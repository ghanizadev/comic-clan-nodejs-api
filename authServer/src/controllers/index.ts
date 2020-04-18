import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import HTTPError from '../errors';
import { RedisClient } from 'redis';
import { logger } from '../utils/logger';
import EventHandler from "../events";

export interface IAuthorize {
    username ?: string;
    password ?: string;
    refresh_token ?: string;
    grant_type: 'password' | 'refresh_token';
    scope ?: string;
}

const accessKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'private-access.pem')).toString().trim();

const refreshKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'private-refresh.pem')).toString().trim();
const refreshKeyPub = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'public-refresh.pem')).toString().trim();

const eventHandler = EventHandler.getInstance();


const issueNewToken = async (db : RedisClient, username: string, password: string, issuer : string, scope: string[], next : NextFunction) => {
    
    return await new Promise((res, rej) => {
        db.hget(username, 'password', (error, value) => {
            if(error) rej(error)
            if(!value) rej({error: 'invalid_client', error_description: 'Please check your username and password', status: 401});
            res(value);
        });
    })
    .then(async value => {
        const user = await eventHandler.publish('users_ch', {
            body: {query: { email: username }},
            event: 'single'
        });

        if(!user.payload.email || !user.payload.password)
            throw new HTTPError('invalid_client', 'Requested user does not exist or it was deleted', 401);

        const {name, _id, email, scopes} = user.payload;
        
        let filteredScopes;
        if(!scope)
            filteredScopes = scopes;
        else if(Array.isArray(scope) && (scope.length === 0 || (scope.length === 1 && scope[0] === '*')))
            filteredScopes = scopes;
        else filteredScopes = scopes.filter((s : string) => scope.includes(s));

        const hash = await bcrypt.hash(password, process.env.PASSWORD_SALT || 8);

        if(hash === value) {
            
            const access_token = jwt.sign({ username: email, id: _id, name, scope: filteredScopes }, {key: accessKey, passphrase: 'tr4df2g5wp'}, { algorithm: 'RS256', expiresIn: '1h', issuer })
            const refresh_token = jwt.sign({ username: email, id: _id, name, scope: filteredScopes }, {key: refreshKey, passphrase: 'tr4df2g5wp'}, { algorithm: 'RS256', issuer});

            db.hset(username, 'refreshToken', refresh_token);

            return {
                token_type: 'bearer',
                access_token,
                expires_in: 60 * 60,
                refresh_token,
                scopes: filteredScopes
            }
        }else {
            throw new HTTPError('unauthorized_client', 'User does not exists, it had been deleted or username and password does not match', 401);
        }
    }).catch(e => {
        console.log(e)
        next(e);
    });
}

const issueFromRefreshToken = async (db : RedisClient, token: string, scope : string[], next : NextFunction ) => {

    let payload : any = {};

    return await new Promise((res : (v : string) => void, rej : (e : any) => void ) => {

        payload = jwt.verify(token, refreshKeyPub, {algorithms: ['RS256', 'RS512']})

        db.hget(payload.username || '', 'refreshToken', (error: any, value: string) => {
            if(error) rej(error)
            if(!value) rej({error: 'invalid_client', error_description: 'This token was issued already. If this problem persists, please, call administrator', status: 401});
            res(value);
        });
    })
    .then(async value => {
        if(value === token) {
            const user = await eventHandler.publish('users_ch', {
                body: {query: { email: payload.username }},
                event: 'single'
            });
    
            if(!user.payload.email || !user.payload.password)
                throw new HTTPError('invalid_client', 'Requested user does not exist or it was deleted', 401);
    
            const {name, _id, email, scopes} = user.payload;
            
            let filteredScopes;

            if(!scope)
                filteredScopes = scopes;

            else if(Array.isArray(scope) && (scope.length === 0 || (scope.length === 1 && scope[0] === '*')))
                filteredScopes = scopes;

            else filteredScopes = scopes.filter((s : string) => scope.includes(s));

            const access_token = jwt.sign({ username: email, id: _id, name, scope: filteredScopes }, {key: accessKey, passphrase: 'tr4df2g5wp'}, { algorithm: 'RS256', expiresIn: '1h', issuer: payload.iss })
            const refresh_token = jwt.sign({ username: email, id: _id, name, scope: filteredScopes }, {key: refreshKey, passphrase: 'tr4df2g5wp'}, { algorithm: 'RS256', issuer: payload.iss});

            db.hset(payload.username, 'refreshToken', refresh_token);

            return {
                token_type: 'bearer',
                access_token,
                expires_in: 60 * 60,
                refresh_token,
                scopes: filteredScopes
            };
        }else {
            throw new HTTPError('invalid_request', "Refresh token does not match", 400);
        }
    }).catch(e => {
        console.log(e)
        next(e);
    });
}

export default {
    async authorize (req : Request, res : Response, next : NextFunction) {
        try{
            let basicAuth : string[];

            if(req.headers?.["content-type"] !== 'application/x-www-form-urlencoded') {
                throw new HTTPError('invalid_request', 'request is malformed, it must be application/x-www-form-urlencoded', 400);
            }

            if(!req.body?.grant_type) {
                throw new HTTPError('invalid_request', 'request is malformed, it must have a grant type field', 400);
            }

            if(!req.headers?.authorization?.startsWith('Basic')) {
                throw new HTTPError('invalid_request', 'a client id and a client secret must be provided', 400);
            } else {
                let auth = req.headers.authorization.split(' ')[1];

                auth = Buffer.from(auth, 'base64').toString();

                basicAuth = auth.split(':');

                await new Promise((res : (v : string) => void, rej : (e : any) => void ) => {
                    req.database.hget('clients', basicAuth[0], (error : any, value : string) => {
                        if(error) rej(error)
                        if(!value) rej({error: 'invalid_client', error_description: "Client credentials are invalid or it does not match", status: 401});
                        res(value);
                    });
                })
                .then(value => {
                    if(value !== basicAuth[1]) throw new HTTPError('invalid_client', 'Client credentials are invalid or it does not match', 401);
                })
                .catch(e => {
                    throw new HTTPError(e);
                })
            }

            if(req.body?.grant_type === 'refresh_token') {
                const token = await issueFromRefreshToken(req.database, req.body.refresh_token, req.body.scope, next);
                res.status(201).send(token);
            } else if (req.body?.grant_type === 'password') {
                const token = await issueNewToken(req.database, req.body.username, req.body.password, basicAuth[0], req.body.scope, next);
                res.status(201).send(token);
            } else if(['authorization_code', 'device_code', 'client_credentials'].includes(req.body?.grant_type)) {
                throw new HTTPError('unsupported_grant_type', 'Supported grant types are: password; refresh_token');
            } else {
                throw new HTTPError('invalid_grant_type', 'Please, provide a valid grant type');
            }
            
        }catch(e){
            next(e);
        }
    },
    async revoke (req : Request, res : Response, next : NextFunction) {
        req.database.hset(req.body.username, 'refreshToken', '', (error, value) => {
            if(error) return res.status(500).send(error);
            if(!value) return res.sendStatus(404);
            return res.sendStatus(204);
        });
    },
    
}
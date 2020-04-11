import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { HTTPError } from '../errors';
import { RedisClient } from 'redis';
import { logger } from '../utils/logger';

export interface IAuthorize {
    username ?: string;
    password ?: string;
    refresh_token ?: string;
    grant_type: 'password' | 'refresh_token';
    scope ?: string;
}

const accessKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'private-access.pem')).toString().trim();
const accessKeyPub = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'public-access.crt')).toString().trim();
const refreshKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'private-refresh.pem')).toString().trim();
const refreshKeyPub = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'public-refresh.crt')).toString().trim();


const issueNewToken = async (db : RedisClient, username: string, password: string, next : NextFunction) => {
    
    return await new Promise((res, rej) => {
        db.hget(username, 'password', (error, value) => {
            if(error) rej(error)
            if(!value) rej({error: 'invalid_client', error_description: 'Please check your username and password', status: 401});
            res(value);
        });
    })
    .then(async value => {
        const hash = await bcrypt.hash(password, process.env.PASSWORD_SALT || 8);

        if(hash === value) {
            const access_token = jwt.sign({ username }, {key: accessKey, passphrase: 'tr4df2g5wp'}, { algorithm: 'RS256', expiresIn: '1h' })
            const refresh_token = jwt.sign({ username }, {key: refreshKey, passphrase: 'tr4df2g5wp'}, { algorithm: 'RS256'});

            db.hset(username, 'refreshToken', refresh_token);

            return {
                token_type: 'bearer',
                access_token,
                expires_in: 60 * 60,
                refresh_token,
                scope: 'feed;profile;post;comment;'
            }
        }else {
            throw new HTTPError('unauthorized_client', 'User does not exists, it had been deleted or username and password does not match', 401);
        }
    }).catch(e => {
        console.log(e)
        next(e);
    });
}

const issueFromRefreshToken = async (db : RedisClient, token: string, next : NextFunction ) => {

    let payload : any = {};

    return await new Promise((res : (v : string) => void, rej : (e : any) => void ) => {

        payload = jwt.verify(token, refreshKeyPub, {algorithms: ['RS256', 'RS512']})

        db.hget(payload.username || '', 'refreshToken', (error: any, value: string) => {
            if(error) rej(error)
            if(!value) rej({error: 'invalid_client', error_description: 'Invalid token, this token was issued already. If this problem persists, please, call administrator', status: 401});
            res(value);
        });
    })
    .then(value => {
        if(value === token) {
            const { username } = payload;

            const access_token = jwt.sign({ username }, {key: accessKey, passphrase: 'tr4df2g5wp'}, { algorithm: 'RS256', expiresIn: '1h',  })
            const refresh_token = jwt.sign({ username }, {key: refreshKey, passphrase: 'tr4df2g5wp'}, { algorithm: 'RS256'});
            db.hset(username || '', 'refreshToken', refresh_token);

            return {
                token_type: 'bearer',
                access_token,
                expires_in: 60 * 60,
                refresh_token,
                scope: 'feed;profile;post;comment;'
            }
        }else {
            throw new HTTPError('unauthorized_client', 'Username and password does not match', 401);
        }
    }).catch(e => {
        console.log(e)
        next(e);
    });
}

export default {
    async authorize (req : Request, res : Response, next : NextFunction) {
        try{
            if(req.headers?.["content-type"] !== 'application/x-www-form-urlencoded') {
                throw new HTTPError('invalid_request', 'request is malformed, it must be application/x-www-form-urlencoded', 400);
            }

            if(!req.headers?.authorization?.startsWith('Basic')) {
                throw new HTTPError('invalid_client', 'a client id and a client secret must be provided');
            } else {
                let auth = req.headers.authorization.split(' ')[1];

                auth = Buffer.from(auth, 'base64').toString();

                const [clientId, clientSecret] = auth.split(':');

                await new Promise((res : (v : string) => void, rej : (e : any) => void ) => {
                    req.database.hget('clients', clientId, (error : any, value : string) => {
                        if(error) rej(error)
                        if(!value) rej({error: 'invalid_client', error_description: "client credentials are invalid or it does not match", status: 401});
                        res(value);
                    });
                })
                .then(value => {
                    if(value !== clientSecret) throw new HTTPError('invalid_client', 'client credentials are invalid or it does not match', 401);
                })
                .catch(e => {
                    throw new HTTPError(e);
                })
            }

            if(req.body?.grant_type === 'refresh_token') {
                const token = await issueFromRefreshToken(req.database, req.body.refresh_token, next);
                res.status(201).send(token);
            } else if (req.body?.grant_type === 'password') {
                const token = await issueNewToken(req.database, req.body.username, req.body.password, next);
                res.status(201).send(token);
            } else if(['authorization_code', 'device_code', 'client_credentials'].includes(req.body?.grant_type)) {
                throw new HTTPError('unsupported_grant_type', 'supproted grant types are: password; refresh_token');
            } else {
                throw new HTTPError('invalid_grant_type', 'please, provide a valid grant type');
            }
            
        }catch(e){
            next(e);
        }
    },
    async revoke (req : Request, res : Response, next : NextFunction) {
        return req.database.hset(req.body.username, 'refreshToken', '', (error, value) => {
            if(error) return res.status(500).send(error);
            if(!value) return res.status(404).send('not_found');
            return res.sendStatus(204);
        });
    },
    
}
import EventHandler from '../events'
import database from '../database';
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { HTTPError } from '../errors';

export interface IAuthorize {
    username ?: string;
    password ?: string;
    refresh_token ?: string;
    grant_type: 'password' | 'refresh_token';
    scope ?: string;
}

const eventHandler = new EventHandler(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth_ch');
eventHandler.listen();

const db = database.connect(process.env.REDIS_SERVER || 'redis://localhost:6379/', 'auth');

//TODO: Deixar legivel
eventHandler.on('newuser', (message) => {
    db.hset(message.body.email, 'password', message.body.password)
})

eventHandler.on('removeuser', (message) => {
    db.del(message.body.email)
})

const issueNewToken = async (username: string, password: string, next : NextFunction) => {
    return await new Promise((res, rej) => {
        db.hget(username, 'password', (error, value) => {
            if(error) rej(error)
            if(!value) rej('not_found');
            res(value);
        });
    })
    .then(async value => {
        const hash = await bcrypt.hash(password, process.env.PASSWORD_SALT || 8);

        if(hash === value) {
            var accessKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'access_token_private.pem')).toString();
            var refreshKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'refresh_token_private.pem')).toString();

            const access_token = jwt.sign({ username }, accessKey, { algorithm: 'RS256', expiresIn: '1h',  })
            const refresh_token = jwt.sign({ username }, refreshKey, { algorithm: 'RS256'});
            db.hset(username, 'refreshToken', refresh_token);

            return {
                token_type: 'bearer',
                access_token,
                expires_in: 60 * 60,
                refresh_token,
                scope: 'feed;profile;post;comment'
            }
        }else {
            throw new HTTPError('unauthorized_client', 'user does not exists, it had been deleted or username and password does not match', 401);
        }
    }).catch(next);
}

const issueFromRefreshToken = async (token: string, next : NextFunction ) => {

    const accessKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'access_token_private.pem')).toString();
    const refreshKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'refresh_token_private.pem')).toString();
    let payload : IAuthorize;

    return await new Promise((res : (v : string) => void, rej : (e : any) => void ) => {
        payload = jwt.verify(token, refreshKey, { algorithms : ['RS256']}) as IAuthorize;
        console.log(payload)

        db.hget(payload.username || '', 'refreshToken', (error: any, value: string) => {
            if(error) rej(error)
            if(!value) rej('not_found');
            res(value);
        });
    })
    .then(value => {
        if(value === token) {
            const { username } = payload;

            const access_token = jwt.sign({ username }, accessKey, { algorithm: 'RS256', expiresIn: '1h',  })
            const refresh_token = jwt.sign({ username }, refreshKey, { algorithm: 'RS256'});
            db.hset(username || '', 'refreshToken', refresh_token);

            return {
                token_type: 'bearer',
                access_token,
                expires_in: 60 * 60,
                refresh_token,
                scope: 'feed;profile;post;comment'
            }
        }else {
            throw new HTTPError('unauthorized_client', 'username and password does not match', 401);
        }
    }).catch(next);
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
                    db.hget('clients', clientId, (error : any, value : string) => {
                        if(error) rej(error)
                        if(!value) rej('not_found');
                        res(value);
                    });
                })
                .then(value => {
                    if(value !== clientSecret) throw new HTTPError('invalid_client', 'client id and client secret does not match', 401);
                })

            }

            if(req.body?.grant_type === 'refresh_token') {
                const token = await issueFromRefreshToken(req.body.refresh_token, next);
                res.status(201).send(token);
            } else if (req.body?.grant_type === 'password') {
                const token = await issueNewToken(req.body.username, req.body.password, next);
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
    async refresh (req : Request, res : Response, next : NextFunction) {
        try{
            if(req.headers?.["content-type"] !== 'application/x-www-form-urlencoded') {
                throw new HTTPError('invalid_request', 'request is malformed, it must be application/x-www-form-urlencoded');
            }
            await new Promise((res, rej) => {
                db.hget(req.body.username, 'password', (error, value) => {
                    if(error) rej(error)
                    if(!value) rej('not_found');
                    res(value);
                });
            })
            .then(async value => {
                const hash = await bcrypt.hash(req.body.password, process.env.PASSWORD_SALT || 8);

                if(hash === value) {
                    var accessKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'access_token_private.pem')).toString();
                    var refreshKey = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'refresh_token_private.pem')).toString();

                    const access_token = jwt.sign({ username: req.body.username }, accessKey, { algorithm: 'RS256', expiresIn: '1h',  })
                    const refresh_token = jwt.sign({ username: req.body.username }, refreshKey, { algorithm: 'RS256'});
                    db.hset(req.body.username, 'refreshToken', refresh_token);

                    res.status(201).send({
                        token_type: 'bearer',
                        access_token,
                        expires_in: 60 * 60,
                        refresh_token,
                        scope: 'feed;profile;post;comment'
                    });
                }else {
                    res.status(401).send();
                }
            }).catch(console.error);
        }catch(e){
            next(e);
        }
    },
    async revoke (req : Request, res : Response, next : NextFunction) {
        return db.hset(req.body.username, 'refreshToken', '', (error, value) => {
            if(error) return res.status(500).send(error);
            if(!value) return res.status(404).send('not_found');
            return res.sendStatus(204);
        });
    },
    
}
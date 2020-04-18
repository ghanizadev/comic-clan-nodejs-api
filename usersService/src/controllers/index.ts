import Database from '../database';
import {IUser} from '../models/usersSchema';
import HTTPError from '../errors';

const User = Database.getInstance().getModel();

export default {
    async create(body : IUserCreateOptions) : Promise<IUser | void> {
        body.email = body.email.trim();
        const findQuery = await User.findOne({email: body.email}).exec();

        if(findQuery) {
            if(findQuery.active === true){
                throw new HTTPError('invalid_request', `User "${findQuery.email}" is already taken`, 400);
            }

            findQuery.set({active: true, password: body.password});

            return findQuery.save()
            .then(async (doc) => {
                return doc;
            })
            .catch(err => {
                if(err.name === 'ValidationError' || err.name === 'ValidatorError'){
                    const messages : string[] = [];

                    Object.keys(err.errors).forEach(key => messages.push(err.errors[key].message))

                    throw new HTTPError('invalid_request', messages.join(' '), 400);
                } else                    
                    throw new HTTPError(err);
            })
        } else {
            const user = new User({...body, scopes: ['feed', 'profile', 'post', 'comment']});

            return user.save()
            .then(async (doc) => {
                return doc;
            })
            .catch(err => {
                if(err.name === 'ValidationError' || err.name === 'ValidatorError'){
                    const messages : string[] = [];

                    Object.keys(err.errors).forEach(key => messages.push(err.errors[key].message))

                    throw new HTTPError('invalid_request', messages.join(' '), 400);
                } else                    
                    throw new HTTPError(err);
            })
        }

    },
    async list(body : IUserListOptions) : Promise<IUser[]> {
        let users = await User.find({ ... body.query, active : true}).exec();

        return (users as IUser[]);
    },

    async single(body : IUserListOptions) : Promise<IUser> {
        let user = await User.findOne({ ... body.query, active : true}).exec();

        return (user as IUser);
    },

    async modify(body : IUserModifyOptions) : Promise<IUser> {
        const queryUser = await User.findOneAndUpdate({ email: body.email, active: true }, body.content, {new : true}).exec();

            
        if(!queryUser) {
            throw new HTTPError(
                'not_found',
                `user with email "${body.email}" is not registered or it is deleted`,
                404
            );
        }
            
        return queryUser;
    },

    async delete(body : IUserDeleteOptions) : Promise<IUser | void> {
        const queryUser = await User.findOne({ email: body.email, active : true }).exec();
        
        if(!queryUser) {
            throw new HTTPError(
                'not_found',
                `user with email "${body.email}" is not registered or it is deleted`,
                404
            );
        }
    
        const check = await queryUser?.compareHash(body.password);

        if(!check)
            throw new HTTPError(
                'unauthorized_client',
                `Password does not match`,
                401
            );
        
        await User.findOneAndUpdate({ email: body.email, active : true }, {active : false}, {new : true}).exec();

        return queryUser;
    }
}

export interface IUserCreateOptions {
    name : string;
    email : string;
    password : string;
}

export interface IUserDeleteOptions {
    email : string;
    password : string;
}
export interface IUserListOptions {
    query : {
        _id ?: string;
        name ?: string;
        email ?: string;
    };
    pagination ?: any;
}

export interface IUserModifyOptions {
    email : string;
    content : {
        name ?: string;
    };
}
import Database from '../database';
import {IUser} from '../models/usersSchema';
import HTTPError from '../error';

var database = new Database('mongodb://localhost:27017', 'comicclan');
const User = database.getModel();

database.connect();

interface IUserCreateOptions {
    name : string;
    email : string;
    password : string;
}

interface IUserDeleteOptions {
    email : string;
}
interface IUserListOptions {
    query : {
        _id ?: string;
        name ?: string;
        email ?: string;
    };
    pagination ?: any;
}

interface IUserModifyOptions {
    email : string;
    content : {
        name ?: string;
    };
}

export default {
    async create(body : IUserCreateOptions) : Promise<IUser | void> {
        const findQuery = await User.findOne({email: body.email, active : false}).exec();
        if(findQuery) {
            findQuery.set({active: true, password: body.password});

            return findQuery.save()
            .then(async (doc) => {
                return doc;
            })
            .catch(err => {
                throw new HTTPError('failed_to_save', err.message, 400);
            })
        } else {
            const user = new User(body);

            return user.save()
            .then(async (doc) => {
                return doc;
            })
            .catch(err => {
                throw new HTTPError('failed_to_save', err.message, 400);
            })
        }

    },
    async list(body : IUserListOptions) : Promise<IUser[]> {
        let users = await User.find({ ... body.query, active : true}).exec();

        return (users as IUser[]);
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

    async delete(body : IUserDeleteOptions) : Promise<IUser | null> {
        const queryUser = await User.findOneAndUpdate({ email: body.email, active : true }, {active : false}, {new : true}).exec();

        if(!queryUser) {
            throw new HTTPError(
                'not_found',
                `user with email "${body.email}" is not registered or it is deleted`,
                404
            );
        }
        
        return queryUser;
    }
}
import Database from '../database';
import HTTPError from '../error';

var database = new Database('mongodb://localhost:27017', 'comicclan');
const User = database.getModel();

database.connect();

interface IUserReturn {
    _v : number;
    _id : string;
    name : string;
    email : string;
    createdAt : any;
    updatedAt: any;
}

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
        password ?: string;
    };
}

export default {
    async create(body : IUserCreateOptions) : Promise<IUserReturn | void> {
        const user = new User(body);

        return user.save()
        .then(async (doc) => {
            const { _id, _v, email, name, createdAt, updatedAt } = doc;

            return {
                name,
                email,
                _id,
                _v,
                createdAt,
                updatedAt
            };
        })
        .catch(err => {
            throw new HTTPError('failed_to_save', err.message, 400);
        })
    },
    async list(body : IUserListOptions) : Promise<IUserReturn[]> {
        let users = await User.find({ ... body.query, active : true}).exec();
        users = users.map(user => {
            const u = user.toObject();
            
            delete u['active'];
            delete u['password'];

            return u;
        })

        return (users as IUserReturn[]);
    },

    async modify(body : IUserModifyOptions) : Promise<IUserReturn> {
        const queryUser = await User.findOneAndUpdate({ email: body.email, active: true }, body.content, {new : true}).exec();

            
        if(!queryUser) {
            throw new HTTPError(
                'not_found',
                `user with email "${body.email}" is not registered or it is deleted`,
                404
            );
        }
            
        const { _id, _v, email, name, createdAt, updatedAt } = queryUser;

        return {
            name,
            email,
            _id,
            createdAt,
            updatedAt,
            _v
        };
    },

    async delete(body : IUserDeleteOptions) : Promise<IUserReturn | null> {
        const queryUser = await User.findOneAndUpdate({ email: body.email, active : true }, {active : false}, {new : true}).exec();

        if(!queryUser) {
            throw new HTTPError(
                'not_found',
                `user with email "${body.email}" is not registered or it is deleted`,
                404
            );
        }

        const { _id, _v, email, name, createdAt, updatedAt } = queryUser;

        return {
            name,
            email,
            _id,
            _v,
            createdAt,
            updatedAt
        };
    }
}
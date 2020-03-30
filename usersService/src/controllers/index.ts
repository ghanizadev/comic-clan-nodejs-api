import Database, { IUser } from '../models';
import HTTPError from '../error';

var database = new Database('mongodb://localhost:27017', 'comicclan');
const User = database.getModel();

database.connect();

interface IUserReturn {
    _id : string;
    name : string;
    email : string;
    createdAt : string;
    updatedAt: string;
}

interface IUserCreateOptions {
    name : string;
    email : string;
    password : string;
}
interface IUserListOptions {
    query : {
        id ?: string;
        name ?: string;
        email ?: string;
    };
    pagination ?: any;
}

interface IUserModifyOptions {
    name ?: string;
    password ?: string;
}

export default {
    async create(body : IUserCreateOptions) : Promise<IUserReturn | null> {
        const user = new User(body);

        return user.save()
        .then(async (doc) => {
            const { _id, email, name, createdAt, updatedAt } = doc;

            return {
                name,
                email,
                _id,
                createdAt,
                updatedAt
            };
        })
        .catch(err => {
            throw new HTTPError('failed_to_save', err.message, 400);
        })
    },
    async list(body : IUserListOptions) : Promise<IUserReturn[] | null> {
        try {
            const users = await User.find(body.query).exec();

            return (users as IUserReturn[]);

        } catch (e) {
            throw new HTTPError(
                'internal_error',
                'something went bad, check logs for further information',
                500
            );
        }
    },

    async modify(userEmail : string, body : IUserModifyOptions) : Promise<IUserReturn | null> {
        try {
            const queryUser = await User.findOne({ email: userEmail }).exec();

            queryUser.set(body);
            const { _id, email, name, createdAt, updatedAt } = await queryUser.save();

            if(!queryUser) {
                // Handle error
                return null
            }

            return {
                name,
                email,
                _id,
                createdAt,
                updatedAt
            };

        } catch (e) {
            // Handle error
            return null;
        }
    },

    async delete(userEmail : string) : Promise<IUserReturn | null> {
        try {
            const queryUser = await User.findOne({ email: userEmail }).exec();

            queryUser.set({ active : false });
            const { _id, email, name, createdAt, updatedAt } = await queryUser.save();

            if(!queryUser) {
                // Handle error
                return null
            }

            return {
                name,
                email,
                _id,
                createdAt,
                updatedAt
            };

        } catch (e) {
            // Handle error
            return null;
        }
    }
}
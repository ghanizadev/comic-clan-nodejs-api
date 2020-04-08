import mongoose from 'mongoose';
import { IUser } from '../models/usersSchema';
export default class Database {
    private connectionString;
    private UserModel;
    constructor(connectionString: string, databaseName?: string);
    connect(): Promise<mongoose.Mongoose | void>;
    getModel(): mongoose.Model<IUser>;
}

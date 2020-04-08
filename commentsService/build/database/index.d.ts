import mongoose, { Mongoose } from 'mongoose';
import { IComment } from '../models/commentsSchema';
export default class Database {
    private static instance;
    private constructor();
    static getInstance(): Database;
    connect(connectionString: string, databaseName?: string): Promise<Mongoose | void>;
    getModel(): mongoose.Model<IComment>;
}

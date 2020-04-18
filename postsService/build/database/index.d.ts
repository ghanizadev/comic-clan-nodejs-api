import mongoose, { Mongoose } from 'mongoose';
import { IPost } from "../models/IPost";
export default class Database {
    private static instance;
    private constructor();
    static getInstance(): Database;
    connect(connectionString: string): Promise<Mongoose | void>;
    getModel(): mongoose.Model<IPost>;
}

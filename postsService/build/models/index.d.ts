import mongoose from 'mongoose';
export interface IPost extends mongoose.Document {
    userId: string;
    description: string;
    body: string;
    media?: string[];
    comments?: string[];
    updatedAt?: string;
    createdAt?: string;
    _id: string;
    _v: number;
}
export default class Database {
    private connectionString;
    private UserModel;
    private createPostSchema;
    constructor(connectionString: string, databaseName?: string);
    connect(): Promise<mongoose.Mongoose | void>;
    getModel(): mongoose.Model<IPost>;
}

import mongoose, { Model, Mongoose } from 'mongoose';
import postsSchema, { IPost } from '../models'

export default class Database {

    private connectionString : string;

    constructor(connectionString : string, databaseName : string = 'comicclan') {
        this.connectionString = connectionString + '/' + databaseName;
    }

    public async connect() : Promise<Mongoose | void> {
        try{
            return await mongoose.connect(this.connectionString, {
                useCreateIndex: true,
                useFindAndModify: false,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch(e) {
            console.error(e); //Logger
        }
        return;
    }

    public getModel() : Model<IPost> {
        return postsSchema;
    }
}
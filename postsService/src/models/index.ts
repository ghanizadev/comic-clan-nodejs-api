import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
    userId: string;
    description : string;
    body : string;
    media ?: string[];
    comments ?: string[];
    updatedAt ?: string;
    createdAt ?: string;
    _id : string;
    _v : number;
}

export default class Database {

    private connectionString : string;
    private UserModel : mongoose.Model<IPost>;

    private createPostSchema() {
        const UserSchema = new mongoose.Schema({
            userId: { type: String , required: true },
            description: { type: String , required: true },
            body: { type: String , required: true },
            media: { type: [String] , default: [] },
            comments: { type: [String] , default: [] }
        }, { timestamps: true, collection: 'posts' });

        return mongoose.model<IPost>('Post', UserSchema);
    }

    constructor(connectionString : string, databaseName : string = 'comicclan') {
        this.UserModel = this.createPostSchema();
        this.connectionString = connectionString + '/' + databaseName;
    }

    public async connect() : Promise<mongoose.Mongoose | void> {
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

    public getModel() : mongoose.Model<IPost> {
        return this.UserModel;
    }
}
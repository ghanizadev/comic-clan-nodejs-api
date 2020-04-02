import * as mongoose from 'mongoose';

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
    private connection : mongoose.Mongoose;

    private createCommentSchema() {
        const UserSchema = new mongoose.Schema({
            postId: { type: String , required: true },
            media: { type: [String] , default: [] },
            comments: { type: [String] , default: [] }
        }, { timestamps: true, collection: 'posts' });

        this.UserModel = mongoose.model<IPost>('Post', UserSchema);
    }

    constructor(connectionString : string, databaseName : string = 'comicclan') {
        this.createCommentSchema();
        this.connectionString = connectionString + '/' + databaseName;
    }

    public async connect() : Promise<mongoose.Mongoose> {
        try{
            this.connection = await mongoose.connect(this.connectionString, {
                useCreateIndex: true,
                useFindAndModify: false,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch(e) {
            console.error(e); //Logger
        }

        return this.connection;
    }

    public getModel() : mongoose.Model<IPost> {
        return this.UserModel;
    }

    public getInterface() : mongoose.Mongoose {
        return this.connection;
    }
}
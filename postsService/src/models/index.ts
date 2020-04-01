import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IPost extends mongoose.Document {
    userId: string;
    description : string;
    body : string;
    media ?: string[];
    updatedAt ?: string;
    createdAt ?: string;
    _id : string;
    _v : number;
}

export default class Database {

    private connectionString : string;
    private UserModel : mongoose.Model<IPost>;
    private connection : mongoose.Mongoose;

    private createPostSchema() {
        const UserSchema = new mongoose.Schema({
            userId: { type: String , required: true },
            description: { type: String , required: true },
            body: { type: String , required: true },
            media: { type: [String] , default: [] }
        }, { timestamps: true, collection: 'posts' });

        this.UserModel = mongoose.model<IPost>('Post', UserSchema);
    }

    constructor(connectionString : string, databaseName : string = 'comicclan') {
        this.createPostSchema();
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
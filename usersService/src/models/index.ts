import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
    name: string;
    email : string;
    password : string;
    createdAt ?: string;
    updatedAt ?: string;
    active ?: boolean;
}

export default class Database {

    private connectionString : string;
    private UserModel : mongoose.Model<IUser>;
    private connection : mongoose.Mongoose;

    private createUserSchema() {
        const UserSchema = new mongoose.Schema({
            name: { type: String , required: true },
            email: { type: String , required: true, unique: true },
            password: { type: String , required: true },
            active: { type: Boolean , default: true }
        }, { timestamps: true, collection: 'users' });

        UserSchema.pre('save', async function(next) {
            if (!this.isModified('password')) next();

            (this as IUser).password = await bcrypt.hash((this as IUser).password, 8);
        });

        this.UserModel = mongoose.model<IUser>('User', UserSchema);
    }

    constructor(connectionString : string, databaseName : string = 'comicclan') {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);

        this.createUserSchema();
        this.connectionString = connectionString + databaseName;
    }

    public async connect() : Promise<mongoose.Mongoose> {
        try{
            this.connection = await mongoose.connect(this.connectionString);
        } catch(e) {
            console.error(e); //Logger
        }

        return this.connection;
    }

    public getModel() : mongoose.Model<IUser> {
        return this.UserModel;
    }

    public getInterface() : mongoose.Mongoose {
        return this.connection;
    }
}
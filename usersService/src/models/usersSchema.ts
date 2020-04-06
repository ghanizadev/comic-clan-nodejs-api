import mongoose, {Document, Schema} from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    email : string;
    password : string;
    createdAt ?: string;
    updatedAt ?: string;
    active ?: boolean;
    _id : string;
    _v : number;
    [key : string] : any;
    compareHash: (hash: string) => Promise<boolean>;
}

const UserSchema = new Schema({
    name: { type: String , required: true },
    email: { type: String , required: true, unique: true },
    password: { type: String , required: true },
    active: { type: Boolean , default: true }
}, { timestamps: true, collection: 'users' });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next();

    (this as IUser).password = await bcrypt.hash((this as IUser).password, process.env.PASSWORD_SALT || 8);
});

UserSchema.methods = {
    compareHash(hash: string) {
        return bcrypt.compare(hash, this.password);
    },
};

export default mongoose.model<IUser>('User', UserSchema);
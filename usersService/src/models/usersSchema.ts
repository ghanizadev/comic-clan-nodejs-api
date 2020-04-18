import mongoose, {Document, Schema} from 'mongoose';
import * as bcrypt from 'bcrypt';
import validEmail from '../utils/emailChecker';
import config from '../config/config'

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
    name: {
        type: String,
        required: true,
        validate: {
            validator: (value : string) => value !== '',
            message: "Name cannot be an empty string.",
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value : string) => validEmail(value),
            message: value => `"${value.value}" is not a valid email, please check and try again.`,
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value : string) => config.pwRegex.test(value),
            message: "Incorrect password format, please verify.",
        }
    },
    active: { type: Boolean , default: true }
}, { timestamps: true, collection: 'users' });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next();
    
    (this as IUser).password = await bcrypt.hash((this as IUser).password, process.env.PASSWORD_SALT || 8);
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('email')) next();

    (this as IUser).email = (this as IUser).email.trim();
});

UserSchema.methods = {
    async compareHash(password: string) {
        return bcrypt.compare(password, this.password);
    },
};

export default mongoose.model<IUser>('User', UserSchema);
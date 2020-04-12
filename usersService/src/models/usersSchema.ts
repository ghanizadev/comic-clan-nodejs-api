import mongoose, {Document, Schema} from 'mongoose';
import * as bcrypt from 'bcrypt';
import validEmail from '../utils/emailChecker';

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g
const pwRegex = new RegExp(process.env.PW_REGEX ||'');

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
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value : string) => validEmail(value),
            message: value => `${value.value} is not a valid email, please check and try again`,
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value : string) => pwRegex.test(value),
            message: "incorrect password format, please verify",
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
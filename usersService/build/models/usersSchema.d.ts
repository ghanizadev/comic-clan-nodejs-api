import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
    active?: boolean;
    _id: string;
    _v: number;
    [key: string]: any;
    compareHash: (hash: string) => Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}>;
export default _default;

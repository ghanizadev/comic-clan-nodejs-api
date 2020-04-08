import mongoose, { Document } from 'mongoose';
export interface IComment extends Document {
    userId: string;
    body: string;
    media?: string[];
    updatedAt?: string;
    createdAt?: string;
    _id: string;
    _v: number;
}
declare const _default: mongoose.Model<IComment, {}>;
export default _default;

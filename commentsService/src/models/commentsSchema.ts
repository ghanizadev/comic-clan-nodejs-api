
import * as mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
    userId: string;
    body : string;
    media ?: string[];
    updatedAt ?: string;
    createdAt ?: string;
    _id : string;
    _v : number;
}

const UserSchema = new mongoose.Schema({
    userId: { type: String , required: true },
    body: { type: String , required: true },
    media: { type: [String] , default: [] },
}, { timestamps: true, collection: 'posts' });


export default mongoose.model<IPost>('Post', UserSchema);
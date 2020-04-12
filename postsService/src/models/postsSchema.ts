import mongoose, {Document, Schema} from 'mongoose';

export interface IPost extends Document {
    userId: string;
    description : string;
    body : string;
    media ?: string[];
    comments : string[];
    updatedAt ?: string;
    createdAt ?: string;
    _id : string;
    _v : number;
}

const UserSchema = new Schema({
    userId: { type: String , required: true },
    description: { type: String , required: true },
    body: { type: String , required: true },
    media: { type: [String] , default: [] },
    comments: { type: [String] , default: [] }
}, { timestamps: true, collection: 'posts' });

export default mongoose.model<IPost>('Post', UserSchema);
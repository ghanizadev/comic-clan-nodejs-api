
import mongoose, {Document, Schema} from 'mongoose';

export interface IComment extends Document {
    userId: string;
    body : string;
    media ?: string[];
    updatedAt ?: string;
    createdAt ?: string;
    _id : string;
    _v : number;
}

const UserSchema = new Schema({
    userId: { type: String , required: true },
    body: { type: String , required: true },
    media: { type: [String] , default: [] },
}, { timestamps: true, collection: 'comments' });


export default mongoose.model<IComment>('Comments', UserSchema);
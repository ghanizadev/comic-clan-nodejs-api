
import mongoose, {Document, Schema} from 'mongoose';

export interface IComment extends Document {
    userId: string;
    body : string;
    media ?: string[];
    comments : string[];
    acceptComments ?: boolean;
    updatedAt ?: string;
    createdAt ?: string;
    _id : string;
    _v : number;
}

const UserSchema = new Schema({
    userId: { type: String , required: true },
    body: { type: String , required: true },
    media: { type: [String] , default: [] },
    comments: { type: [String] , default: [] },
    acceptComments: {type: Boolean, default: true}
}, { timestamps: true, collection: 'comments' });


export default mongoose.model<IComment>('Comments', UserSchema);
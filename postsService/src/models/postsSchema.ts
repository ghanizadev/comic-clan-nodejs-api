import {Schema, model, Document} from 'mongoose';
import pagination from 'mongoose-paginate-v2';
import { IPost } from './IPost';
import { IModel } from './IModel';

const PostSchema = new Schema<IPost>({
    userId: { type: String , required: true },
    description: { type: String , required: true },
    body: { type: String , required: true },
    media: { type: [String] , default: [] },
    comments: { type: [String] , default: [] }
}, { timestamps: true, collection: 'posts' });

PostSchema.plugin(pagination); 

export default model<IPost, IModel>('Post', PostSchema);
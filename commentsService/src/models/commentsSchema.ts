
import mongoose, {Schema} from 'mongoose';
import { IComment } from './IComment';
import { IModel } from './IModel';
import pagination from 'mongoose-paginate-v2'

const CommentSchema = new Schema({
    userId: { type: String , required: true },
    body: { type: String , required: true },
    media: { type: [String] , default: [] },
    comments: { type: [String] , default: [] },
    acceptComments: {type: Boolean, default: true}
}, { timestamps: true, collection: 'comments' });

CommentSchema.plugin(pagination)

export default mongoose.model<IComment, IModel>('Comments', CommentSchema);
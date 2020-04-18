import { Model } from 'mongoose';
import { IPost } from './IPost';
export interface IModel extends Model<IPost> {
    paginate: (query: any, options: any) => Promise<any>;
}

import { Model } from 'mongoose';
import { IComment } from './IComment';
export interface IModel extends Model<IComment> {
    paginate: (query: any, options: any) => Promise<any>;
}

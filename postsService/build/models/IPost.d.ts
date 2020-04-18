import { Document } from 'mongoose';
export interface IPost extends Document {
    userId: string;
    description: string;
    body: string;
    media?: string[];
    comments: string[];
    updatedAt?: string;
    createdAt?: string;
    _id: string;
    _v: number;
    user?: any;
    paginate?: (query: any, options: any) => IPost[];
}

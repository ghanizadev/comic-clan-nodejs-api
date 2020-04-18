import { Document } from 'mongoose';
export interface IComment extends Document {
    userId: string;
    body: string;
    media?: string[];
    comments: string[];
    acceptComments?: boolean;
    updatedAt?: string;
    createdAt?: string;
    _id: string;
    _v: number;
}

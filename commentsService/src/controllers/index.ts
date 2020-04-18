import HTTPError from '../errors';
import Comment from '../models/commentsSchema';
import { ICommentAddCommentOptions } from './ICommentAddCommentOptions';
import { ICommentModifyOptions } from './ICommentModifyOptions';
import { ICommentListOptions } from './ICommentListOptions';
import { ICommentDeleteOptions } from './ICommentDeleteOptions';
import { ICommentCreateOptions } from './ICommentCreateOptions';
import { ICommentDTO } from './ICommentDTO';
import EventHandler from '../events';
import { IComment } from '../models/IComment';

const eventHandler = EventHandler.getInstance();

export default {
    async create(body : ICommentCreateOptions) : Promise<ICommentDTO | void> {
        const user = new Comment(body);

        return user.save()
        .then(async (doc) => {
            const { _id, _v, userId, body, media, comments, createdAt, updatedAt } = doc;

            return {
                _id,
                userId,
                body,
                media,
                comments,
                createdAt,
                updatedAt,
                _v,
            };
        })
        .catch(err => {
            throw new HTTPError('failed_to_save', err.message, 400);
        })
    },
    async list(body : ICommentListOptions) : Promise<ICommentDTO[]> {
        let queryComments = await Comment.find(body.query);
0
        const results =
            queryComments.map(async (comment : IComment) => {
                const { userId, body, media, createdAt, updatedAt, _id, _v} = comment;

                const result : ICommentDTO = {
                    body,
                    media,
                    createdAt,
                    updatedAt,
                    _id,
                    _v
                };

                eventHandler.publish('users_ch', {
                    event: 'list',
                    body: {query : { _id : userId }}
                }).then((reply) => {
                    const user = reply.payload.shift();

                    delete user.password;
                    delete user.active;

                    delete comment.userId;

                    result.user = user;
                })
                .catch(e => {
                    console.log(e);
                    throw new HTTPError(e);
                })

                
                if(Array.isArray(comment.comments) && comment.acceptComments){
                    const subcommentsPromises : Promise<any>[] = [];

                    result.comments = await Comment.find({_id: { $in: comment.comments as string[]}})
                    result.comments.forEach((comment : any) => {

                        const promise =
                            new Promise((resolve : any, reject : any) => {

                                eventHandler.publish('users_ch', {
                                    event: 'list',
                                    body: {query : { _id : comment.userId }}
                                }).then((reply) => {
                                    const user = reply.payload.shift();

                                    delete user.password;
                                    delete user.acive;

                                    const before = comment.toObject()
                                    delete before.userId;
                                    
                                    const res : ICommentDTO = {
                                        ...before,
                                        user
                                    }

                                    resolve(res);
                                })
                                .catch(reject)
                            })

                        subcommentsPromises.push(promise);
                    })

                    result.comments = await Promise.all(subcommentsPromises);

                }        

                return result
            })

        return Promise.all(results);
    },

    async modify(modifiedComment : ICommentModifyOptions) : Promise<ICommentDTO> {
        const queryComment = await Comment.findOneAndUpdate({ _id: modifiedComment._id }, modifiedComment.content, {new : true}).exec();

            
        if(!queryComment) {
            throw new HTTPError(
                'not_found',
                `post with id=${modifiedComment._id} does not exist or it is deleted`,
                404
            );
        }
            
        const { _id, _v, userId, body, media, comments, createdAt, updatedAt } = queryComment;


        return {
            _id,
            body,
            media,
            comments,
            createdAt,
            updatedAt,
            _v,
        }
    },

    async addComment(modifiedComment : ICommentAddCommentOptions) : Promise<ICommentDTO | void> {
        const queryPost = await Comment.findOne({ _id: modifiedComment.id }).exec();

        if(!queryPost)
            throw new HTTPError('invalid_request', 'Comment ws not found or it is deleted', 400);

        if(!queryPost.acceptComments)
            throw new HTTPError('invalid_request', 'It is not possible to reply a reply', 400);
        
        queryPost.comments.push(modifiedComment.commentId);

        const result = await queryPost.save();

        if(!result) {
            throw new HTTPError(
                'not_found',
                `Comment does not exist or it is deleted`,
                404
            );
        }
            
        const { _id, _v, userId, comments, body, media, createdAt, updatedAt } = result;


        return {
            _id,
            body,
            media,
            comments,
            createdAt,
            updatedAt,
            _v,
        }
    },

    async delete(deleteOptions : ICommentDeleteOptions) : Promise<ICommentDTO | void> {
        const queryComment = await Comment.findOneAndDelete({ _id: deleteOptions._id }).exec();

        if(!queryComment) {
            throw new HTTPError(
                'not_found',
                `post with id=${deleteOptions._id} does not exist or it is deleted`,
                404
            );
        }

        const { _id, _v, userId, body, media, comments, createdAt, updatedAt } = queryComment;

        return {
            _id,
            body,
            media,
            comments,
            createdAt,
            updatedAt,
            _v,
        }
    }
}
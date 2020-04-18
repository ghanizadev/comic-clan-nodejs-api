import { IUser } from '../models/usersSchema';
declare const _default: {
    create(body: IUserCreateOptions): Promise<void | IUser>;
    list(body: IUserListOptions): Promise<IUser[]>;
    modify(body: IUserModifyOptions): Promise<IUser>;
    delete(body: IUserDeleteOptions): Promise<void | IUser>;
};
export default _default;
export interface IUserCreateOptions {
    name: string;
    email: string;
    password: string;
}
export interface IUserDeleteOptions {
    email: string;
    password: string;
}
export interface IUserListOptions {
    query: {
        _id?: string;
        name?: string;
        email?: string;
    };
    pagination?: any;
}
export interface IUserModifyOptions {
    email: string;
    content: {
        name?: string;
    };
}

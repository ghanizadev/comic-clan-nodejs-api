import { IUser } from '../models/usersSchema';
interface IUserCreateOptions {
    name: string;
    email: string;
    password: string;
}
interface IUserDeleteOptions {
    email: string;
}
interface IUserListOptions {
    query: {
        _id?: string;
        name?: string;
        email?: string;
    };
    pagination?: any;
}
interface IUserModifyOptions {
    email: string;
    content: {
        name?: string;
    };
}
declare const _default: {
    create(body: IUserCreateOptions): Promise<void | IUser>;
    list(body: IUserListOptions): Promise<IUser[]>;
    modify(body: IUserModifyOptions): Promise<IUser>;
    delete(body: IUserDeleteOptions): Promise<IUser | null>;
};
export default _default;

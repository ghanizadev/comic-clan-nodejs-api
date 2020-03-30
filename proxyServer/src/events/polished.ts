import { Reply } from "./eventHandler";

export default abstract class IResponseType {
    type ?: 'reply';
    from ?: string;
    replyTo ?: string;
    condition ?: 'ok' | 'error' | 'notfound';

    polished<T>() {
        if(this.error)
    }
}
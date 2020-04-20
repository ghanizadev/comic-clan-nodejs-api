import Body from './Body';
import { RedisClient } from 'redis';
declare const _default: {
    set(body: Body, database: RedisClient): Promise<Body>;
    get(database: RedisClient): Promise<Body>;
    setDefault(body: Body, database: RedisClient): Promise<Body>;
    getDefault(database: RedisClient): Promise<Body>;
};
export default _default;

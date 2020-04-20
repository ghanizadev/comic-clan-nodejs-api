import Body from './Body';
import { RedisClient } from 'redis';

export default {
    async set(body: Body, database: RedisClient) {
        return new Promise((resolve : (value : Body) => void, reject : (err : any) => void) => {
            database.set('current', JSON.stringify(body), (err) => {
                if(err) reject(err);

                resolve(body);
            });
        })
    },
    async get(database: RedisClient) {
        return new Promise((resolve : (value : Body) => void, reject : (err : any) => void) => {
            database.get('current', (err, config) => {
                if(err) reject(err);

                resolve(JSON.parse(config));
            });
        })
    },
    async setDefault(body: Body, database: RedisClient) {
        return new Promise((resolve : (value : Body) => void, reject : (err : any) => void) => {
            database.set('dafault', JSON.stringify(body), (err) => {
                if(err) reject(err);

                resolve(body);
            });
        })
    },
    async getDefault(database: RedisClient) {
        return new Promise((resolve : (value : Body) => void, reject : (err : any) => void) => {
            database.get('dafault', (err, config) => {
                if(err) reject(err);

                resolve(JSON.parse(config));
            });
        })
    }
}
import mongoose, {Mongoose, Model} from 'mongoose';
import usersSchema, {IComment} from '../models/commentsSchema';
import { logger } from '../utils/logger';

export default class Database {
    private static instance : Database;

    private constructor() {}

    public static getInstance() : Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    public async connect(connectionString : string, databaseName : string = 'comicclan') : Promise<Mongoose | void> {
        const conn = connectionString + '/' + databaseName;

        let count = 0;

        logger.info('Trying to connect to database...');
        const t = setInterval(async ()=> {
            try{
                await mongoose.connect(conn, {
                    useCreateIndex: true,
                    useFindAndModify: false,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                clearInterval(t);
                return;
            } catch(e) {
                if(count >= 30){
                    console.error('Failed!');
                    clearInterval(t);
                    process.exit(1);
                } else {
                    return count++;
                }
            }
        }, 1000);

        mongoose.connection.once('connected', () => logger.info('Database connected!'))

    }

    public getModel() : mongoose.Model<IComment> {
        return usersSchema;
    }
}
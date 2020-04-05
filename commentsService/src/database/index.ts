import mongoose from 'mongoose';
import commentsSchema, {IPost} from '../models/commentsSchema';

export default class Database {

    private connectionString : string;
    private UserModel : mongoose.Model<IPost>;

    constructor(connectionString : string, databaseName : string = 'comicclan') {
        this.UserModel = commentsSchema;
        this.connectionString = connectionString + '/' + databaseName;
    }

    public async connect() : Promise<mongoose.Mongoose | void> {
        let count = 0;

        console.log('Trying to connect to database...');
        const t = setInterval(async ()=> {
            try{
                await mongoose.connect(this.connectionString, {
                    useCreateIndex: true,
                    useFindAndModify: false,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                clearInterval(t);
                return;
            } catch(e) {
                if(count >= 30){
                    console.error('Failed to connect to database!');
                    clearInterval(t);
                    process.exit(1);
                } else {
                    return count++;
                }
            }
        }, 1000);

    }

    public getModel() : mongoose.Model<IPost> {
        return this.UserModel;
    }
}
export default (o: any) => {
    if(o.payload){
        const result = o.payload;

        delete result.level;
        delete result.replyTo;
        delete result.from;
        delete result.active;
        delete o.userId;
        delete o.password;

        return result;
    }

    delete o.level;
    delete o.replyTo;
    delete o.from;
    delete o.active;
    delete o.userId;
    delete o.password;

    return o;
}
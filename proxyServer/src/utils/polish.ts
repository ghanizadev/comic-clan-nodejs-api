export default (o: object) => {
    if(o['payload']){
        const result = o['payload'];

        delete result['level'];
        delete result['replyTo'];
        delete result['from'];
        delete result['active'];

        return result;
    }

    delete o['level'];
    delete o['replyTo'];
    delete o['from'];
    delete o['active'];

    return o;
}
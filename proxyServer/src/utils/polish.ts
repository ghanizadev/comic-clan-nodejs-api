export default (o: object) => {
    if(o['payload']) return o['payload'];

    delete o['level']
    delete o['replyTo']
    delete o['from']

    return o;
}
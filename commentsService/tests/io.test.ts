import { Message } from '../src/events';
import faker from 'faker';
const channel = 'comments_ch';

let mock : Message =  {
    event: 'create',
    body: {
        email: faker.internet.email(),
        name: faker.name.firstName(),
        password: faker.internet.password(),
    }
}

describe('#Create', () => {
    it('Should return proper data on create', () => {
        //Finish tests
    })
});
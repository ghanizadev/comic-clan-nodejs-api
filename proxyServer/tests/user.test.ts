import request from 'supertest';
import { assert } from 'chai';
import server from '../src/server';
import * as faker from 'faker';

const NAME = faker.name.firstName();
const EMAIL = faker.internet.email();
const PWD = faker.internet.password();

describe('/users', () => {
    it('should post a new user', async () => {
        const res = await request(server)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send({
            email: EMAIL,
            name: NAME,
            password: PWD,
        })

        assert.equal(res.status, 201, "Expect requested to be created");
        assert.equal(res.body.name, NAME, "Name should be the same");
        assert.equal(res.body.email, EMAIL, "Name should be the same");
        assert.hasAnyKeys(res.body, ['id'], "Should return one id");
        assert.doesNotHaveAnyDeepKeys(res.body, ['pwd', 'password'], "Expect password field to be ommited");
    })
    it('should login with email and password', async () => {
        const res = await request(server)
        .post('/oauth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
            email: EMAIL,
            password: PWD,
        })
        .auth('comicclan', 'ilovecomicbooks', {type: 'basic'});

        assert.equal(res.status, 201, "Expect requested to be created");
        assert.equal(res.body.name, NAME, "Name should be the same");
        assert.equal(res.body.email, EMAIL, "Email should be the same");
        assert.hasAllKeys(res.body, ['access_token', 'token_type', 'iat', 'exp'], "Should return one a token");
        assert.doesNotHaveAnyKeys(res.body, ['pwd', 'password'], "Expect password field to be ommited");
    })
})
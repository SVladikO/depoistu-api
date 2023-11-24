const request = require('supertest');
const assert = require('assert');
const app = require('../index.js');
const mocha = require('mocha');
const {TOKEN_NAME} = require("../middleware/auth.middleware.js");
const {TOKEN} = require("./utils.spec.js")

describe(`CUSTOMER`, function () {
    describe(`POST /sing-in`, function () {
        it('request success', function (done) {
            request(app)
                .post('/sign-in')
                .send({email: 'vlad.serhiychuk@gmail.com', password: 'pma1111'})
                .set('Accept', 'application/json')
                .expect(200, done);
        });
        it('request broken validation', function (done) {
            request(app)
                .post('/sign-in')
                .set('Accept', 'application/json')
                .expect(401, done);
        });
    })


    describe(`POST /sign-up`, function () {
        const customer = {
            name: 'testName',
            phone: '380970668830',
            password: '120291vv',
            email: new Date().getTime() + '@gmail.com',
            join_date: new Date().getTime(),
            can_create_companies: 1,
            isBusinessOwner: true
        }
        it('request success', function (done) {
            request(app)
                .post('/sign-up')
                .send(customer)
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.OWNER)
                .expect(200, done);
        });

//         it('request broken validation', function (done) {
//             request(app)
//                 .post('/sign-up')
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(400, done);
//         });
    })
    describe(`POST /edit-business-type`, function () {
        it('request success with token', function (done) {
            request(app)
                .post('/edit-business-type')
                .send({isBusinessOwner: true})
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.OWNER)
                .expect(200, done);
        });
        it('request error without token', function (done) {
            request(app)
                .post('/edit-business-type')
                .set('Accept', 'application/json')
                .expect(401, done);
        });
        it('request error with broken token', function (done) {
            request(app)
                .post('/edit-business-type')
                .send({isBusinessOwner: true})
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.BROKEN)
                .expect(401, done);
        });
    });
})


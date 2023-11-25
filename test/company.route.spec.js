const request = require('supertest');
const mocha = require('mocha');
const expect = require('expect.js');
const app = require('../index.js');

const {TOKEN_NAME} = require("../middleware/auth.middleware.js");
const {TOKEN} = require("./utils.spec.js")

describe(`COMPANY`, function () {
    describe(`GET /available-city-ids`, function () {
        it('response success', async function () {
            const response = await request(app)
                .get('/available-city-ids')
                .set('Accept', 'application/json')

                expect(response.status).to.be.equal(200);
                expect(response.body).to.be.a('array');
        });
    })

    describe(`GET /companies/cities/:cityId`, function () {
        it('response success', async function () {
            const response = await request(app)
                .get(`/companies/cities/204`)
                .set('Accept', 'application/json')

                expect(response.status).to.be.equal(200);
                expect(response.body).to.be.a('array');
        });
        it('response error', function (done) {
            request(app)
                .get(`/companies/cities/scr`)
                .set('Accept', 'application/json')
                .expect(200, done);
        });
    })

    const company = {
        id: 1,
        name: 'testCompanyName',
        phone1: '280970668830',
        phone2: '280970668830',
        phone3: '280970668830',
        cityId: 204,
        street: 'street Test 2',
        schedule: ', , , , , , , , , ,,',
    }

    const companiesUrl = '/companies';

    describe(`POST ${companiesUrl}`, function () {
        it('request success with token', function (done) {
            request(app)
                .post(companiesUrl)
                .send(company)
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.OWNER)
                .expect(200, done);
        });
        it('request error without token', function (done) {
            request(app)
                .post(companiesUrl)
                .send(company)
                .set('Accept', 'application/json')
                .expect(401, done);
        });
        it('request error with broken token', function (done) {
            request(app)
                .post(companiesUrl)
                .send(company)
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.BROKEN)
                .expect(401, done);
        });

        //       TODO: CHECK LIMITED ABOUT OF CREATE COMPANY
        //        it('request error with wrong owner', function (done) {
        //            request(app)
        //                .post('/companies')
        //                .send(company)
        //                .set('Accept', 'application/json')
        //                .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
        //                .expect(401, done);
        //        });
    });

    describe(`PUT /company`, function () {
        it('request success with token', function (done) {
            request(app)
                .put(companiesUrl)
                .send(company)
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.OWNER)
                .expect(200, done);
        });
        it('request error without token', function (done) {
            request(app)
                .put(companiesUrl)
                .send(company)
                .set('Accept', 'application/json')
                .expect(401, done); 
        });
        it('request error with broken token', function (done) {
            request(app)
                .put(companiesUrl)
                .send(company)
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.BROKEN)
                .expect(401, done);
        });
        it('request error with wrong owner', function (done) {
            request(app)
                .put(companiesUrl)
                .send(company)
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
                .expect(403, done);
        });
    });
});

//     describe(`DELETE company`, function () {
//         it('request success with token', function (done) {
//             request(app)
//                 .delete(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//         it('request error without token', function (done) {
//             request(app)
//                 .delete(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//
//                 .expect(401, done);
//         });
//         it('request error with broken token', function (done) {
//             request(app)
//                 .delete(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.BROKEN)
//
//                 .expect(401, done);
//         });
//         it('request error with wrong owner', function (done) {
//             request(app)
//                 .delete(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
//
//                 .expect(403, done);
//         });
//     });
// })

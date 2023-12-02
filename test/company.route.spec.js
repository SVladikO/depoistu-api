const request = require('supertest');
const mocha = require('mocha');
const app = require('../index.js');

const {TOKEN, wrappedRequest, requestWithoutToken, requestWithBrokenToken} = require("./utils.spec.js")
const {TOKEN_NAME} = require("../middleware/auth.middleware.js");

describe(`COMPANY`, function () {
    before(() => {
        console.log('before')
    })

    after(() => {
        console.log('after')
    })


    describe(`GET /available-city-ids`, function () {
        it('response success', function (done) {
            wrappedRequest
                .get('/available-city-ids')
                .expect(200, done);
        });
    })

    describe(`GET /companies/cities/:cityId`, function () {
        it('response success', function (done) {
            wrappedRequest
                .get(`/companies/cities/204`)
                .expect(200, done);
        });
        it('response error', function (done) {
            wrappedRequest
                .get(`/companies/cities/scr`)
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
        schedule: '09:00-21:00,09:00-21:00,09:00-21:00,09:00-21:00,09:00-21:00,09:00-21:00,09:00-21:00',
    }

    const companiesUrl = '/companies';

    describe(`POST ${companiesUrl}`, function () {
        it('request success with token', function (done) {
            wrappedRequest
                .post(companiesUrl)
                .send(company)
                .expect(200, done);
        });

        requestWithoutToken('post', companiesUrl)
        requestWithBrokenToken('post', companiesUrl)


        //       TODO: CHECK LIMITED ABOUT OF CREATE COMPANY
        //        it('request error with wrong owner', function (done) {
        //            wrappedRequest
        //                .post('/companies')
        //                .send(company)
        //                .set('Accept', 'application/json')
        //                .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
        //                .expect(401, done);
        //        });
    });

    describe(`PUT /company`, function () {
        it('request success with token', function (done) {
            wrappedRequest
                .put(companiesUrl)
                .send(company)
                .expect(200, done);
        });

        requestWithoutToken('put', companiesUrl)
        requestWithBrokenToken('put', companiesUrl)

        it('request error with wrong owner', function (done) {
            wrappedRequest
                .put(companiesUrl)
                .send(company)
                .expect(403, done);
        });
    });
});

//     describe(`DELETE company`, function () {
//         it('request success with token', function (done) {
//             wrappedRequest
//                 .delete(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//         it('request error without token', function (done) {
//             wrappedRequest
//                 .delete(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//
//                 .expect(401, done);
//         });
//         it('request error with broken token', function (done) {
//             wrappedRequest
//                 .delete(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.BROKEN)
//
//                 .expect(401, done);
//         });
//         it('request error with wrong owner', function (done) {
//             wrappedRequest
//                 .delete(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
//
//                 .expect(403, done);
//         });
//     });
// })

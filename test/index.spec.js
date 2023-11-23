const request = require('supertest');
const assert = require('assert');
const app = require('../index.js');
const mocha = require('mocha');
const SELECTED_LANGUAGE_ON_FE = request('../utils/translation.utils.js')
const {TOKEN_NAME} = require("../middleware/auth.middleware");

const TOKEN = {
    // token from developDevelop@gmail.com
    OWNER: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkZXZlbG9wRGV2ZWxvcEBnbWFpbC5jb20iLCJwYXNzd29yZCI6InBtYTExMTEiLCJpYXQiOjE3MDA3MjU4OTF9.m9BEw8SmFOJpyucIif-3SLoto4v0PRdNZq_GZSkZlWE`,
    BROKEN: 'broken token',
    // token from vlad.seehiychuk@gmail.com
    WRONG_OWNER: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjgsImVtYWlsIjoidmxhZC5zZWVoaXljaHVrQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZWVlZWVlIiwiaWF0IjoxNzAwNzI1OTUwfQ.MiiNa15tFGkuDBj_FwqHM3JmQWZ4RFp94Gck5oKSA5c`,
}


describe('MENU', function () {

    describe('GET /menu', function () {
        it('request success', function (done) {
            request(app)
                .get('/menu/1')
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it('request error', function (done) {
            request(app)
                .get('/menu/asdf')
                .set('Accept', 'application/json')
                .expect(400, done)
        });
    });

    describe('GET /menu/only-visible', function () {
        it('request success', function (done) {
            request(app)
                .get('/menu/only-visible/1')
                .set('Accept', 'application/json')
                .expect(200, done);
        });
        it('request error', function (done) {
            request(app)
                .get('/menu/only-visible/asdf')
                .set('Accept', 'application/json')
                .expect(400, done);
        });
    });

  const menuItem = {
        id: 1,
        categoryId: 1,
        companyId: 1,
        name: 'testFoodName',
        description: 'testFood description',
        size_1: 300,
        price_1: 100,
        size_2: 500,
        price_2: 150,
        size_3: 700,
        price_3: 200,
        isVisible: true,
        imageUrl: '',
    }

    describe('POST /menu', function () {
        it('request success with token', function (done) {
            request(app)
                .post('/menu')
                .send(menuItem)
                .set(TOKEN_NAME, TOKEN.OWNER)
                .set('Accept', 'application/json')
                .expect(201, done);
        });
        it('request error without token', function (done) {
            request(app)
                .post('/menu')
                .send(menuItem)
                .set('Accept', 'application/json')
                .expect(401, done);
        });
        it('request error with broken token', function (done) {
            request(app)
                .post('/menu')
                .send(menuItem)
                .set('Accept', 'application/json')
                .set(TOKEN_NAME, TOKEN.BROKEN)
                .expect(401, done);
        });
    });
 describe('PUT /menu', function () {
     it('request success with token', function (done) {
         request(app)
             .put('/menu')
             .send(menuItem)
             .set(TOKEN_NAME, TOKEN.OWNER)
             .set('Accept', 'application/json')
             .expect(200, done);
     });
     it('request error without token', function (done) {
         request(app)
             .put('/menu')
             .send(menuItem)
             .set('Accept', 'application/json')
             .expect(401, done);
     });
     it('request error with broken token', function (done) {
         request(app)
             .put('/menu')
             .send(menuItem)
             .set('Accept', 'application/json')
             .set(TOKEN_NAME, TOKEN.BROKEN)
             .expect(401, done);
     });
     it('request error with wrong owner', function (done) {
         request(app)
             .put('/menu')
             .send(menuItem)
             .set('Accept', 'application/json')
             .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
             .expect(401, done);
     });
 });

 const menuVisibleUrlPUT = '/menu/visible'
 describe(`PUT ${menuVisibleUrlPUT}`, function () {
     it('request success with token', function (done) {
         request(app)
             .put(menuVisibleUrlPUT)
             .send(menuItem)
             .set('Accept', 'application/json')
             .set(TOKEN_NAME, TOKEN.OWNER)
             .expect(200, done);
     });
     it('request error without token', function (done) {
         request(app)
             .put(menuVisibleUrlPUT)
             .set('Accept', 'application/json')
             .expect(401, done);
     });
     it('request error with broken token', function (done) {
         request(app)
             .put(menuVisibleUrlPUT)
             .set('Accept', 'application/json')
             .set(TOKEN_NAME, TOKEN.BROKEN)
             .expect(401, done);
     });
     it('request error with wrong owner', function (done) {
         request(app)
             .put(menuVisibleUrlPUT)
             .send(menuItem)
             .set('Accept', 'application/json')
             .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
             .expect(401, done);
     });
 });
 });

//     const menuUrlDELETE = '/menu'
//     describe(`PUT ${menuUrlDELETE}`, function () {
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
//                 .expect(401, done);
//         });
//     });
//
//     const availableCityIdsUrlGET = '/available-city-ids'
//     describe(`GET ${availableCityIdsUrlGET}`, function () {
//         it('response success', function (done) {
//             request(app)
//                 .get(availableCityIdsUrlGET)
//                 .set('Accept', 'application/json')
//
//                 .expect(200, done);
//         });
//     })
//
//     const companiesByCityIdUrGET = '/companies/cities'
//     describe(`GET ${availableCityIdsUrlGET}`, function () {
//         it('response success', function (done) {
//             request(app)
//                 .get(`${companiesByCityIdUrGET}/204`)
//                 .set('Accept', 'application/json')
//
//                 .expect(200, done);
//         });
//         it('response error', function (done) {
//             request(app)
//                 .get(`${companiesByCityIdUrGET}/scr`)
//                 .set('Accept', 'application/json')
//
//                 .expect(200, done);
//         });
//     })
// })
//
// describe(`COMPANY`, function () {
//     describe(`POST company`, function () {
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
//                 .expect(401, done);
//         });
//     });
//
//     describe(`PUT company`, function () {
//         it('request success with token', function (done) {
//             request(app)
//                 .put(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//         it('request error without token', function (done) {
//             request(app)
//                 .put(menuUrlDELETE)
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
//                 .put(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
//
//                 .expect(401, done);
//         });
//     });
//
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
//                 .expect(401, done);
//         });
//     });
// })
//
// describe(`CUSTOMER`, function () {
//     describe(`POST sing-in`, function () {
//         it('request success', function (done) {
//             request(app)
//                 .post(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//         it('request broken validation', function (done) {
//             request(app)
//                 .post(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//     })
//
//     describe(`POST sing-un`, function () {
//         it('request success', function (done) {
//             request(app)
//                 .post(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//         it('request broken validation', function (done) {
//             request(app)
//                 .post(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//     })
//     describe(`POST /edit-business-type`, function () {
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
//                 .expect(401, done);
//         });
//     });
// })
//
// describe(`FAVORITE-COMCPANIES`, function () {
//         describe(`GET ${availableCityIdsUrlGET}`, function () {
//             it('response success', function (done) {
//                 request(app)
//                     .get(availableCityIdsUrlGET)
//                     .set('Accept', 'application/json')
//
//                     .expect(200, done);
//             });
//
//             it('response success', function (done) {
//                 request(app)
//                     .get(availableCityIdsUrlGET)
//                     .set('Accept', 'application/json')
//
//                     .expect(200, done);
//             });
//         })
//
//     describe(`POST FAVORITE COMPNAY`, function () {
//         it('request success with token', function (done) {
//             request(app)
//                 .put(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//         it('request error without token', function (done) {
//             request(app)
//                 .put(menuUrlDELETE)
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
//                 .put(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
//
//                 .expect(401, done);
//         });
//     });
//
//     describe(`GET FAVORITE COMPNAY`, function () {
//         it('request success with token', function (done) {
//             request(app)
//                 .put(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.OWNER)
//
//                 .expect(200, done);
//         });
//         it('request error without token', function (done) {
//             request(app)
//                 .put(menuUrlDELETE)
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
//                 .put(menuUrlDELETE)
//                 .set('Accept', 'application/json')
//                 .set(TOKEN_NAME, TOKEN.WRONG_OWNER)
//
//                 .expect(401, done);
//         });
//     });
//     }
// )

const request = require('supertest');
const assert = require('assert');
const app = require('../index.js');
const mocha = require('mocha');
const {TOKEN_NAME} = require("../middleware/auth.middleware.js");
const {TOKEN} = require("./utils.spec.js")


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
                .expect(403, done);
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
                .expect(403, done);
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
})
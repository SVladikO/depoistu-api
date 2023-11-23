const request = require('supertest');
const assert = require('assert');
const app = require('../index.js');
const mocha = require('mocha');
const SELECTED_LANGUAGE_ON_FE = request('../utils/translation.utils.js')
const {TOKEN_NAME} = require("../middleware/auth.middleware");

const TOKEN = {
    OWNER: '',
    BROKEN: '',
    WRONG_OWNER: '',
}

describe('GET /menu', function() {
    it('responds success', function(done) {
        request(app)
            .get('/menu/1')
            .set('Accept', 'application/json')
//            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('request with broken param', function(done) {
        request(app)
            .get('/menu/asdf')
            .set('Accept', 'application/json')
            .expect(400, done);
    });
});

//
// describe('GET /menu/only-visible', function() {
//     it('responds success', function(done) {
//         request(app)
//             .get('/menu/only-visible/1')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200, done);
//     });
//     it('request with missed param', function(done) {
//         request(app)
//             .get('/menu/only-visible')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400, done);
//     });
//     it('request with broken param', function(done) {
//         request(app)
//             .get('/menu/only-visible/asdf')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400, done);
//     });
// });
//
// describe('POST /menu', function() {
//     it('with token', function(done) {
//         request(app)
//             .post('/menu')
//             .set('Accept', 'application/json')
//             .set(TOKEN_NAME, TOKEN.OWNER)
//             .expect('Content-Type', /json/)
//             .expect(200, done);
//     });
//     it('without token', function(done) {
//         request(app)
//             .post('/menu')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400, done);
//     });
//     it('with broken token', function(done) {
//         request(app)
//             .post('/menu')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400, done);
//     });
// });
//
// describe('PUT /menu', function() {
//     it('with token', function(done) {
//         request(app)
//             .post('/menu')
//             .set('Accept', 'application/json')
//             .set(TOKEN_NAME, TOKEN.OWNER)
//             .expect('Content-Type', /json/)
//             .expect(200, done);
//     });
//     it('without token', function(done) {
//         request(app)
//             .post('/menu')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400, done);
//     });
//     it('with broken token', function(done) {
//         request(app)
//             .post('/menu')
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400, done);
//     });
// });
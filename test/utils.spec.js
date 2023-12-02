const app = require("../index");
const request = require('supertest');
const packageJson = require('../package.json');

const {TOKEN_NAME} = require("../middleware/auth.middleware");

const REQUEST_HEADER_FIELD = {
    CLIENT_VERSION: 'client-version'
}

const wrappedRequest =
    request(app)
        .set(REQUEST_HEADER_FIELD.CLIENT_VERSION, packageJson.version)
        .set('Accept', 'application/json')
        .set(TOKEN_NAME, TOKEN.WRONG_OWNER)

const TOKEN = {
    // token from developDevelop@gmail.com
    OWNER: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkZXZlbG9wRGV2ZWxvcEBnbWFpbC5jb20iLCJwYXNzd29yZCI6InBtYTExMTEiLCJpYXQiOjE3MDA3MjU4OTF9.m9BEw8SmFOJpyucIif-3SLoto4v0PRdNZq_GZSkZlWE`,
    BROKEN: 'broken token',
    // token from vlad.seehiychuk@gmail.com
    WRONG_OWNER: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjgsImVtYWlsIjoidmxhZC5zZWVoaXljaHVrQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiZWVlZWVlIiwiaWF0IjoxNzAwNzI1OTUwfQ.MiiNa15tFGkuDBj_FwqHM3JmQWZ4RFp94Gck5oKSA5c`,
}

function requestWithoutToken(method, url) {
    it('request error without token 401', function (done) {
        request(app)[method](url)
            .send(url)
            .set('Accept', 'application/json')
            .expect(401, done);
    });
}

function requestWithBrokenToken(method, url) {
    it('request error with broken token 401', function (done) {
        request(app)[method](url)
            .send(url)
            .set('Accept', 'application/json')
            .set(TOKEN_NAME, TOKEN.BROKEN)
            .expect(401, done);
    });
}

module.exports = {
    TOKEN,
    requestWithoutToken,
    requestWithBrokenToken,
    wrappedRequest
};
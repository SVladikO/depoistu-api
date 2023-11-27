const request = require('supertest');
const assert = require('assert');
const app = require('../index.js');
const mocha = require('mocha');
const {TOKEN_NAME} = require("../middleware/auth.middleware.js");
const {TOKEN, requestWithoutToken, requestWithBrokenToken} = require("./utils.spec.js")

describe(`FAVORITE-COMPANIES `, function () {
        const favoriteCompanyUrl = '/favorite-companies';

        describe(`GET ${favoriteCompanyUrl}/:customerId}`, function () {
            it('response success', function (done) {
                request(app)
                    .get('/favorite-companies/1')
                    .set('Accept', 'application/json')
                    .expect(200, done);
            });

            it('response error', function (done) {
                request(app)
                    .get('/favorite-companies/customerId')
                    .set('Accept', 'application/json')
                    .expect(200, done);
            });
        })

        describe(`POST /favorite-companies`, function () {
            it('request success with token', function (done) {
                request(app)
                    .post('/favorite-companies')
                    .send({company_id: 1})
                    .set('Accept', 'application/json')
                    .set(TOKEN_NAME, TOKEN.OWNER)
                    .expect(200, done);
            });
            
            requestWithoutToken('post', '/favorite-companies')
            requestWithBrokenToken('post', '/favorite-companies')
            
        });
    }
)

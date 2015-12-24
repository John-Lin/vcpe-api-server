'use strict';
let supertest = require('supertest');
let should = require('should');
let express = require('express');
let app = require('../app');
const config = require('config');

const hasVCPEUsername = config.has('VCPE_ACCOUNT_TEST.username');
const hasVCPEPassword = config.has('VCPE_ACCOUNT_TEST.password');

let username = hasVCPEUsername ?
  config.get('VCPE_ACCOUNT_TEST.username') :
  process.env.VCPE_USERNAME;
let password = hasVCPEPassword ?
  config.get('VCPE_ACCOUNT_TEST.password') :
  process.env.VCPE_PASSWORD;

describe('vCPE APIs basic tests for routes/index.js', function() {
  this.timeout(4000);
  let token = null;

  before((done) => {
    supertest(app)
      .post('/auth/login')
      .send({username: username, password: password})
      .end(function(err, res) {
        token = res.body.token;
        done();
      });
  });

  describe('vCPE API root route tests', () => {
    it('should return status code 200', (done) => {
      supertest(app)
        .get('/api/v1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200, done);
    });
  });

});

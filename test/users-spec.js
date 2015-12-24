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

describe('vCPE APIs users tests for routes/users.js', function() {
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

  describe('vCPE users sign up API tests', () => {
    it('should create an user and return uuid in json', (done) => {
      const user = {
        email: 'linton.tw@gmail.com',
        username: 'linton',
      };
      supertest(app)
        .post('/api/v1/users/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect('Content-Type', /json/)
        .expect(201, done);
    });
  });

  describe('vCPE get users settings API tests', () => {
    it('should return a user information without error', (done) => {
      supertest(app)
        .get('/api/v1/users/linton')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return status code 204', (done) => {
      supertest(app)
        .get('/api/v1/users/he110')
        .set('Authorization', `Bearer ${token}`)
        .expect(204, done);
    });
  });
});

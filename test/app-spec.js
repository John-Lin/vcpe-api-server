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

describe('vCPE API Server root test', () => {
  it('should return status code 200', (done) => {
    supertest(app)
      .get('/')
      .expect(200, done);
  });
});

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

describe('vCPE APIs users tests for routes/settings.js', function() {
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

  describe('vCPE router status switch', () => {
    it('should switch router status to ON', (done) => {
      const status = {
        username: 'linton',
        routerStatus: 'ON',
      };
      supertest(app)
        .put('/api/v1/settings/router/status')
        .set('Authorization', `Bearer ${token}`)
        .send(status)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
    it('should return 400', (done) => {
      const status = {
        username: 'linton',
      };
      supertest(app)
        .put('/api/v1/settings/router/status')
        .set('Authorization', `Bearer ${token}`)
        .send(status)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

  });

  describe('vCPE router detail settings setup', () => {
    it('should updated router detail settings', (done) => {
      const details = {
        username: 'linton',
        routerStatus: 'ON',
        routerWANPort: 1,
        routerPublicIP: '140.114.99.199',
        routerDefultGateway: '140.114.99.254',
        routerLocalNetwork: '192.168.8.0',
      };
      supertest(app)
        .put('/api/v1/settings/router/detail')
        .set('Authorization', `Bearer ${token}`)
        .send(details)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return 400', (done) => {
      const status = {
        routerStatus: 'ON',
      };
      supertest(app)
        .put('/api/v1/settings/router/detail')
        .set('Authorization', `Bearer ${token}`)
        .send(status)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

  });

});

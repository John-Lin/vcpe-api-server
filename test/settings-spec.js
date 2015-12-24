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
        routerState: 'ON',
      };
      supertest(app)
        .put('/api/v1/settings/router/state')
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
        .put('/api/v1/settings/router/state')
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
        wanPort: 1,
        publicIP: '140.114.111.222',
        defultGateway: '140.114.99.111',
        localNetwork: '192.168.2.0',
      };
      supertest(app)
        .put('/api/v1/settings/router/details')
        .set('Authorization', `Bearer ${token}`)
        .send(details)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return 400', (done) => {
      const status = {
        routerState: 'ON',
      };
      supertest(app)
        .put('/api/v1/settings/router/details')
        .set('Authorization', `Bearer ${token}`)
        .send(status)
        .expect('Content-Type', /json/)
        .expect(400, done);
    });

  });

});

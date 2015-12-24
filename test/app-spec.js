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

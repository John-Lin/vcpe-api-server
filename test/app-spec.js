'use strict';
let supertest = require('supertest');
let should = require('should');
let express = require('express');
let app = require('../app');

describe('vCPE API root route tests', () => {
  it('should return status code 200', (done) => {
    supertest(app)
      .get('/api/v1')
      .expect(200, done);
  });
});

describe('vCPE users sign in API tests', () => {
  it('should create an user and return uuid in json', function(done) {
    this.timeout(4000);
    const user = {
      email: 'linton.tw@gmail.com',
      name: 'john',
    };
    supertest(app)
      .post('/api/v1/users/sigin')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(201, done);
  });
});

describe('vCPE get users settings API tests', () => {
  it('should return a user information without error', function(done) {
    this.timeout(4000);
    supertest(app)
      .get('/api/v1/users/5f6b6b13-c3e4-4d5b-8661-c833dfc64c87')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should return status code 204', function(done) {
    this.timeout(4000);
    supertest(app)
      .get('/api/v1/users/aabbccdd-3333-2222-1111-c833dfc64c87')
      .expect(204, done);
  });
});

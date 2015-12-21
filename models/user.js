'use strict';
const vogels = require('vogels');
const Joi = require('joi');

// Loading credentials from JSON file
// vogels.AWS.config.loadFromPath(`./config/credentials.json`);

vogels.AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

let Account = vogels.define('Account', {
  hashKey: 'email',

  // add the timestamp attributes (updatedAt, createdAt)
  timestamps: true,
  schema: {
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    vCPEUUID: vogels.types.uuid(),
    settings: {
      containerid: Joi.string(),
      nickname: Joi.string(),
      router: {
        routerStatus: Joi.string(),
        routerWANPort: Joi.number(),
        routerPublicIP: Joi.string().ip(),
        routerDefultGateway: Joi.string().ip(),
        routerLocalNetwork: Joi.string().ip(),
      },
    },
  },
  tableName: 'vcpe-account',
});
module.exports = Account;

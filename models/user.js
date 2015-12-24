'use strict';
const vogels = require('vogels');
const Joi = require('joi');
const config = require('config');
const debug = require('debug')('configure');

// Loading credentials from JSON file
// vogels.AWS.config.loadFromPath(`./config/credentials.json`);

const hasKeyID = config.has('AWS_CREDENTIALS.accessKeyId');
const hasAccessKey = config.has('AWS_CREDENTIALS.secretAccessKey');
const hasRegion = config.has('AWS_CREDENTIALS.region');

// If credentials in the config folder
if (hasKeyID && hasAccessKey && hasRegion) {
  vogels.AWS.config.update({
    accessKeyId: config.get('AWS_CREDENTIALS.accessKeyId'),
    secretAccessKey: config.get('AWS_CREDENTIALS.secretAccessKey'),
    region:  config.get('AWS_CREDENTIALS.region'),
  });
} else { // Credentials not in config folder use env variables
  vogels.AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
}

debug(`Now in ${process.env.NODE_ENV} mode!`);

let Account = vogels.define('Account', {
  hashKey: 'username',

  // add the timestamp attributes (updatedAt, createdAt)
  timestamps: true,
  schema: {
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    vCPEID: vogels.types.uuid(),
    settings: {
      container: {
        id: Joi.string(),
        name: Joi.string(),
      },
      router: {
        currentState: Joi.string(),
        wanPort: Joi.number(),
        publicIP: Joi.string().ip(),
        defultGateway: Joi.string().ip(),
        localNetwork: Joi.string().ip(),
      },
    },
  },
  tableName: 'vcpe-accounts',
});
module.exports = Account;

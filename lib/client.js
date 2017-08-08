'use strict';

const version = require('./../package.json').version;

let processConfig = {
  environment: process.env.NODE_ENV,
  project: process.env.GCLOUD_PROJECT,
  name: process.env.FUNCTION_NAME,
  directory: process.env.PWD,
  trigger: null,
  memory: parseInt(process.env.FUNCTION_MEMORY_MB),
  home: process.env.HOME
};

switch (process.env.FUNCTION_TRIGGER_TYPE) {
  case 'HTTP_TRIGGER':
    processConfig.trigger = 'http';
    break;
}

module.exports = class FunctionalClient {
  constructor (req, res) {
    this._version = version;
    this._req = req;
    this._res = res;
    this._response = null;
    this._config = processConfig;
  }

  error (error, status = 400) {
    console.log(status, error);
    // TODO:
    // EXTRACT MESSAGE FROM ERROR AND SEND IT?
    this.send('Error.', status);
  }

  json (data, status) {
    let string;
    if (typeof data !== 'object') {
      throw new Error('Data provided must be an object');
    } else {
      try {
        string = JSON.stringify(data, null, '');
      } catch (error) {
        throw new Error('Error parsing JSON response');
      }
      this.send(string, status);
    }
  }

  send (string, status = 200) {
    if (this._response) {
      throw new Error('Response has already been sent.');
    } else if (typeof string !== 'string') {
      throw new Error('Send function requires string.');
    } else {
      this._res.status(status).send(string);
      this._response = { status, sent: string };
    }
  }
  
  get version () {
    return this._version;
  }

  get req () {
    return this._req;
  }

  get res () {
    return this._res;
  }

  get config () {
    return this._config;
  }

  get response () {
    return this._response;
  }
};
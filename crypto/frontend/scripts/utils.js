const path = require('path');
const http = require('http');
const https = require('https');
const env = require('@next/env');

const logger = {
  log: console.log,
  info() {
    console.info('\x1b[32m%s\x1b[0m', ...arguments);
  },
  warn: console.warn,
  error() {
    console.error('\x1b[31m%s\x1b[0m', ...arguments);
  },
  get verbose() {
    return this;
  },
  get silent() {
    return new Proxy(logger, {
      get(target, prop) {
        if (prop in target) {
          return () => undefined;
        }
      },
    });
  },
};

const fetcher = (protocol) => {
  switch (protocol) {
    case 'http:':
      return http;
    case 'https:':
      return https;
    default:
      throw new Error('Invalid protocol');
  }
};

const stripBOM = (str) => {
  if (str.charCodeAt(0) === 0xfeff) {
    return str.slice(1);
  }

  return str;
};

const checkCWD = () => {
  const dir = process.cwd();
  const root = path.resolve(__dirname, '..');

  if (dir !== root) {
    throw 'Invalid root directory.';
  }
};

const loadEnv = (dir = process.cwd(), dev = true) => {
  env.loadEnvConfig(dir, dev, logger.silent);
};

module.exports = {
  logger,
  fetcher,
  stripBOM,
  checkCWD,
  loadEnv,
};

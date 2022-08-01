'use strict';

const {NextConfig} = require('next');
const relay = require('./relay.config');

/** @type {NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  devIndicators: {
    buildActivity: false,
  },
  compiler: {
    relay,
  },
};

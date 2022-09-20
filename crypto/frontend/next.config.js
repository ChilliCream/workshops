'use strict';

const {NextConfig} = require('next');
const relay = require('./relay.config');

/** @type {NextConfig} */
module.exports = {
  reactStrictMode: false,
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
  swcMinify: true,
};

'use strict';

module.exports = {
  schema: 'schema/server.graphql',
  schemaExtensions: ['schema'],
  src: 'scenes',
  customScalars: {
    DateTime: 'string',
    Upload: 'File | null',
  },
  eagerEsModules: true,
  noFutureProofEnums: false,
  // @see https://github.com/vercel/next.js/discussions/35904
  language: 'flow',

  // @see https://relay.dev/docs/guides/type-emission/#single-artifact-directory
  artifactDirectory: 'generated',

  // @see https://relay.dev/docs/guides/persisted-queries/
  // persistConfig: {
  //   // Remote Persisting
  //   url: 'http://localhost:4000/persist',
  //   params: {},
  //   concurrency: 10,
  //
  //   // Local Persisting
  //   file: './persisted.json',
  // },
};

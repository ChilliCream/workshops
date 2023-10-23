'use strict';

module.exports = {
  schema: 'src/schema/server.graphql',
  schemaExtensions: ['src/schema'],
  src: 'src',
  customScalars: {
    DateTime: 'string',
    Upload: 'File',
  },
  eagerEsModules: false,
  noFutureProofEnums: true,
  language: 'typescript',
  artifactDirectory: 'src/generated',
};

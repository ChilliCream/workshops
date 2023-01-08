'use strict';

module.exports = {
  schema: 'src/schema/server.graphql',
  schemaExtensions: ['src/schema'],
  src: 'src',
  customScalars: {
    Date: 'string',
    DateTime: 'string',
    Uuid: 'string',
    UUID: 'string',
    Decimal: 'number',
    Long: 'number',
    Int: 'number',
    Byte: 'number',
    ByteArray: 'string',
    PaginationAmount: 'number',
    Upload: 'File | null',
  },
  eagerEsModules: false,
  noFutureProofEnums: true,
  language: 'typescript',
  artifactDirectory: 'src/__generated__',
};

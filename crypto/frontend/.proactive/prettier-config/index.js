'use strict';

module.exports = {
  $schema: 'http://json.schemastore.org/prettierrc',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
  bracketSameLine: false,
  arrowParens: 'always',
  plugins: [require.resolve('@ianvs/prettier-plugin-sort-imports')],
  importOrder: ['', '', '^@/(.*)$', '', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
  "overrides": [
    {
      "files": ["*.yml", "*.yaml"],
      "options": {
        "singleQuote": false
      }
    }
  ]
};

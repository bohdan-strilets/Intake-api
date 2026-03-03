'use strict';

const path = require('path');
const tsconfig = require('./tsconfig.prod.json');
const { register } = require('tsconfig-paths');

const { baseUrl, paths } = tsconfig.compilerOptions;
register({
  baseUrl: path.join(__dirname, baseUrl),
  paths,
});
require('./dist/main.js');

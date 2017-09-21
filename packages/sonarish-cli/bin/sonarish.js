#!/usr/bin/env node
/* eslint-disable */
const argv = require('minimist')(process.argv.slice(2))
require('../lib/sonarish').default(argv)

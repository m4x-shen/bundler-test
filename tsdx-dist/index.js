
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./bundler-test.cjs.production.min.js')
} else {
  module.exports = require('./bundler-test.cjs.development.js')
}

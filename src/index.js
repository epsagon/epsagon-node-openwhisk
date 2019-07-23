const epsagon = require('epsagon');
const { config } = require('epsagon');
const openWhiskWrapper = require('./wrappers/openwhisk');
const patcher = require('./patcher.js'); // eslint-disable-line no-unused-vars

epsagon.openWhiskWrapper = f => f;

if (!config.getConfig().isEpsagonDisabled) {
    epsagon.openWhiskWrapper = openWhiskWrapper.openWhiskWrapper;
}


module.exports = epsagon;

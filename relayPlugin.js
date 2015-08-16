var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('./src/server/data/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
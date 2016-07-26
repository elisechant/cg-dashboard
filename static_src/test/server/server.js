var path = require('path');

var smocks = require('smocks');

var authstatus = require('./authstatus');
var api = require('./api');

smocks.id('cg-dashboard-testing');

// add auth status route
authstatus(smocks);
// add all api routes
api(smocks);

// serve static assets from /static
smocks.route({
  id: 'app',
  label: 'Front end assets',
  path: '/{p*}',
  handler: function (req, reply) {
    var url = (req.params.p) ? req.params.p : 'index.html';
    reply.file(path.resolve(__dirname, '../../../static', url));
  }
});

// If not required as a module
if (require.main === module) {
  require('smocks/hapi').start({
    port: 8000,
    host: 'localhost'
  });
}

var plugin = require('smocks/hapi').toPlugin({
}, {
  // smocks init options
});

plugin.attributes = {
  pkg: require('../../../package.json')
};

module.exports = plugin;

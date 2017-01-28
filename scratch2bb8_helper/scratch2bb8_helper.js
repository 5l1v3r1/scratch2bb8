var http = require('http');
var url = require('url');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
var queryString = require('querystring');
var noble = require('noble');
var Cylon = require('cylon');

const PORT = 8080;
const STEPS_BASE = 50;

var heading = 0;

function getQueryObj(req) {
  // gets the query part of the URL and parses it creating an object
  var queryObj = queryString.parse(url.parse(req.url).query);
  return queryObj;

  // queryObj will contain the data of the query as an object
  // and jsonData will be a property of it
  // so, using JSON.parse will parse the jsonData to create an object
  // var obj = JSON.parse( queryObj.jsonData );
}

var uuid = process.env.UUID;
if (uuid == null) {
  console.log("Specify UUID as 'UUID=xxxxxx node scratch2bb8_helper.js'.\nRun 'node_modules/.bin/cylon-ble-scan' to scan devices.");
  process.exit();
} else {
  console.log("Control BB-8 from\n\nhttp://scratchx.org/?url=http://champierre.github.io/scratch2bb8/scratch2bb8.js\n")
}

var server = http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
}).listen(PORT, '127.0.0.1');

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'central', uuid: uuid, module: 'cylon-ble'}
  },
  devices: {
    bb8: { driver: 'bb8', module: 'cylon-sphero-ble'}
  },
  work: function(my) {
    dispatcher.onGet('/forward', function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('forward');

      var steps = parseInt(getQueryObj(req).steps, 10)

      after(100, function() {
        console.log('forward');
        my.bb8.roll(60, heading);
      });
      after(STEPS_BASE * steps, function() {
        my.bb8.roll(0, heading);
      });
    });

    dispatcher.onGet('/right', function(req, res) {
      var degrees = parseInt(getQueryObj(req).degrees, 10);

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('right');

      after(100, function() {
        console.log('right')
        heading = heading + degrees;
        if (heading < 0) {
          heading = 360 + heading;
        } else if (heading >= 360) {
          heading = heading - 360;
        }
        my.bb8.roll(0, heading);
      });
    });

    dispatcher.onGet('/left', function(req, res) {
      var degrees = parseInt(getQueryObj(req).degrees, 10);

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('left');

      after(100, function() {
        console.log('left')
        heading = heading - degrees;
        if (heading < 0) {
          heading = 360 + heading;
        } else if (heading >= 360) {
          heading = heading - 360;
        }
        my.bb8.roll(0, heading);
      });
    });

    dispatcher.onGet('/backward', function(req, res) {
      var steps = parseInt(getQueryObj(req).steps, 10);

      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('backward');

      original_heading = heading;
      heading = heading - 180;
      if (heading < 0) {
        heading = 360 + heading;
      } else if (heading >= 360) {
        heading = heading - 360;
      }

      after(100, function() {
        console.log('backward');
        my.bb8.roll(60, heading);
      });
      after(STEPS_BASE * steps, function() {
        my.bb8.roll(0, original_heading);
        heading = original_heading;
      });
    });

    dispatcher.onGet('/spin', function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('spin');

      after(100, function() {
        my.bb8.spin("left", 200 );
      });
      after(1500, function() {
        my.bb8.stop();
      });
    });
  }
}).start();

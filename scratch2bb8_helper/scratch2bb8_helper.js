var http = require('http');
var url = require('url');
var HttpDispatcher = require('httpdispatcher');
var dispatcher = new HttpDispatcher();
var queryString = require('querystring');
var noble = require('noble');
var Cylon = require('cylon');

const PORT = 8080;
const STEPS_BASE = 50;

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
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

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log("Starting scan.");
    noble.startScanning();
  } else {
    console.log("Stopping scan.");
    noble.stopScanning();
  }
});

var i = 1;
var uuids = [];

noble.on('discover', function(peripheral) {
  var name = peripheral.advertisement.localName
  var uuid = peripheral.id;
  if (name.startsWith('BB-')) {
    console.log("BB-8 is discovered!");
    console.log("[" + i + "] Name: " + name);
    console.log("    UUID: " + uuid);
    uuids.push(uuid);
  }
});

var server = http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
}).listen(PORT, '127.0.0.1');

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'central', uuid: '97c218e5d6c249b68ca46e05dd614f8a', module: 'cylon-ble'}
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
        console.log('heading:', heading);
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
        console.log('heading:', heading);
        my.bb8.roll(0, heading);
      });
    });

    dispatcher.onGet('/backward', function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('backward');

      after(100, function() {
        my.bb8.roll(60, 180);
      });
      after(1500, function() {
        my.bb8.stop();
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


after(3000, function() {
  rl.question('which one: ', function(which) {

    selected = uuids[which - 1];
    if (selected != null) {
      console.log(selected + ' is selected.');


    }
  });
});

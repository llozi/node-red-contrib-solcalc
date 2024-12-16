var sol = require('noaa_solcalc');

module.exports = function(RED) {

  function SolCalc(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    
    node.on('input', function(msg, send, done) {
      if (!msg.payload.hasOwnProperty("datetime") ||
          !msg.payload.hasOwnProperty("latitude") ||
          !msg.payload.hasOwnProperty("longitude"))
      {
        // all 3 properties need to be present or else throw an error
        node.status({});
        var err = "missing input properties in payload.";
        if (done) {
            // Node-RED 1.0 compatible
            done(err);
        } else {
            // Node-RED 0.x compatible
            node.error(err, msg);
        }
      }

      node.trace("calculate next sunrise and sunset after " + msg.payload.datetime.toISOString() +
                 " for latitude " + msg.payload.latitude + ", longitude " + msg.payload.longitude);      
      var sunrise = sol.findNextSunriseFromDate(msg.payload.datetime, msg.payload.latitude, msg.payload.longitude);
      var sunset = sol.findNextSunsetFromDate(msg.payload.datetime, msg.payload.latitude, msg.payload.longitude);
      if (sunrise < sunset) {
        msg.payload["nextevent"] = {
          "event": "sunrise",
          "datetime": sunrise
        };
        msg.payload["afternextevent"] = {
          "event": "sunset",
          "datetime": sunset
        };
        node.status({fill:"gray", shape:"dot", text:"sunrise: " + sunrise.toISOString()});
      } else {
        msg.payload["nextevent"] = {
          "event": "sunset",
          "datetime": sunset
        };
        msg.payload["afternextevent"] = {
          "event": "sunrise",
          "datetime": sunrise
        };
        node.status({fill:"gray", shape:"dot", text:"sunset: " + sunset.toISOString()});
      };
      node.send(msg);
      if (done) {
        // check that 'done' exists to be compatible earlier versions of Node-RED (<1.0)
        done();
      }
    });
  }

  RED.nodes.registerType("solcalc", SolCalc);
}


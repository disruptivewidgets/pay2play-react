var SwarmServerActions = require('../actions/SwarmServerActions');

var request = require('superagent');
import _ from 'lodash';

function fetch(game, callback) {
  // console.log(game);

  var url = '';
  url = "http://swrm.io/bzzr:/" + game["hash"];
  url = "http://swarm-gateways.net/bzzr:/" + game["hash"];

  console.log(url);

  request.get(url)
  .set('Accept', 'application/json')
  .end(function(error, response) {
    if (error) {
      console.error(error);
      return;
    }

    if (response.statusCode == 200) {
      var result = JSON.parse(response.text);

      game["rules"] = result;

      callback(game);
    }
  });
};
function eachAsync(array, f, callback) {
    var doneCounter = 0, results = [];

    array.forEach(function (item) {
        f(item, function (res) {
            doneCounter += 1;
            results.push(res);

            if (doneCounter === array.length) {
                callback(results);
            }
        });
    });
};

module.exports = {
  getGames: function() {
    var hash = "00a45de262be72e59530b182be45292f92d21e9aa029845529dd45cf9330f201";

    var url = '';
    url = "http://swrm.io/bzz:/" + hash + "/?list=true";
    url = "http://swarm-gateways.net/bzz:/" + hash + "/?list=true";

    request.get(url)
    .set('Accept', 'application/json')
    .end(function(error, response) {
      if (error) {
        console.error(error);
        return;
      }

      console.log(response);

      if (response.statusCode == 200) {
            // var entries = result["content"].toJSON();

        var result = JSON.parse(response.text);
        // console.log(result);

        var entries = result["entries"];

        console.log(entries);

        var filtered_entries = _.filter(entries, function(entry) {
            return entry["path"].includes('json');
        });

        console.log("FILTERED ENTRIES");
        console.log(filtered_entries);

        var games = [];
        _.each(filtered_entries, function(filtered_entry) {

          var hash = filtered_entry["hash"];
          var path = filtered_entry["path"]

          var game = {
            "id": path.replace(".json", ""),
            "hash": hash,
            "rules": filtered_entry["rules"]
          };

          // fetch(hash);
          games.push(game);
        });

        function display(objects) {
          setTimeout(function() {
            console.log("display");
            console.log(objects);

            // Session.set("showWagerLoader", false);
            // Session.set("games", objects);

            SwarmServerActions.receivedGames(objects);
          }, 1000);
        }

        eachAsync(games, fetch, display);
      };
      // SearchServerActions.receiveSearchResults(response.body);
    });
  }
};

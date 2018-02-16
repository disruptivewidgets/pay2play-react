var SwarmServerActions = require('../actions/SwarmServerActions');

var request = require('superagent');
import _ from 'lodash';

import * as moment from 'moment';
import 'moment-duration-format';

function fetch_Swarm(game, callback)
{
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

function fetch_Default(game, callback)
{
  // var url = '';
  // url = "http://swrm.io/bzzr:/" + game["hash"];
  // url = "http://swarm-gateways.net/bzzr:/" + game["hash"];
  //
  // console.log(url);
  //
  // request.get(url)
  // .set('Accept', 'application/json')
  // .end(function(error, response) {
  //   if (error) {
  //     console.error(error);
  //     return;
  //   }
  //
  //   if (response.statusCode == 200) {
  //     var result = JSON.parse(response.text);
  //
  //     game["rules"] = result;
  //
  //     callback(game);
  //   }
  // });

  setTimeout(function() {
    if (game["hash"] == "d8fe3958b201c46e3d1ca6d431a11de990457f953f349705669806e514832f1e") {
      game["rules"] = {
        "title": "I bet I can beat you in Starcraft",
        "duration": 600
      }
    }

    if (game["hash"] == "980e7d2ed5d70211dcf0ed9caf1f823c648cfff5b814d1dda8f1002aeb689e13") {
      game["rules"] = {
        "title": "I bet I can beat you in League of Legends",
        "duration": 600
      }
    }

    if (game["hash"] == "f18106752e62b9a5d8eb9918e6cd6943429c74b6bc68aead6a23760d023ce8fc") {
      game["rules"] = {
        "title": "I bet I can beat you in Masters of Conquest",
        "duration": 600
      }
    }

    callback(game);
  }, 1000);
};

function eachAsync(array, f, callback)
{
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

function getGamesSwarm() {
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

        games.push(game);
      });

      function display(objects) {
        setTimeout(function() {
          console.log("display");
          console.log(objects);

          SwarmServerActions.receivedGames(objects);
        }, 1000);
      }

      eachAsync(games, fetch, display);
    };
  });
};
function getGameRulesSwarm(hash, wagerStartTimestamp) {
  var url = '';
  url = "http://swrm.io/bzzr:/" + hash;
  url = "http://swarm-gateways.net/bzzr:/" + hash;

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

      console.log(result);

      window.web3.eth.getBlock('latest', function(err, block) {
        console.log(block);

        console.log(result.duration, block.timestamp, wagerStartTimestamp);

        var timeUntilEnd = result.duration - (block.timestamp - wagerStartTimestamp);

        var timeUntilEndString = moment.duration(timeUntilEnd, "seconds").format("y [years], M [months], d [days], h [hours], m [minutes], s [seconds]");

        result['timeUntilEndString'] = timeUntilEndString;

        SwarmServerActions.receivedGameRules(result);
      });
    }
  });
}

function getGamesDefault() {
  setTimeout(function() {
    var games = [];
    games = [
      {
        "id": 0,
        "hash": "d8fe3958b201c46e3d1ca6d431a11de990457f953f349705669806e514832f1e",
        "rules": {
          "title": "I bet I can beat you in Starcraft",
          "duration": 600
        }
      },
      {
        "id": 1,
        "hash": "980e7d2ed5d70211dcf0ed9caf1f823c648cfff5b814d1dda8f1002aeb689e13",
        "rules": {
          "title": "I bet I can beat you in League of Legends",
          "duration": 600
        }
      },
      {
        "id": 2,
        "hash": "f18106752e62b9a5d8eb9918e6cd6943429c74b6bc68aead6a23760d023ce8fc",
        "rules": {
          "title": "I bet I can beat you in Masters of Conquest",
          "duration": 600
        }
      }
    ];

    function display(objects) {
      setTimeout(function() {
        console.log("display");
        console.log(objects);

        SwarmServerActions.receivedGames(objects);
      }, 1000);
    }

    eachAsync(games, fetch_Default, display);
  }, 1000);
}
function getGameRulesDefault (hash, wagerStartTimestamp) {

  setTimeout(function() {
    window.web3.eth.getBlock('latest', function(err, block) {
      console.log(block);

      var duration = 0;
      var result = {
      };

      if (hash == "d8fe3958b201c46e3d1ca6d431a11de990457f953f349705669806e514832f1e") {
        duration = 600;
        result['title'] = "I bet I can beat you in StartCraft";
      }

      if (hash == "980e7d2ed5d70211dcf0ed9caf1f823c648cfff5b814d1dda8f1002aeb689e13") {
        duration = 600;
        result['title'] = "I bet I can beat you in League of Legends";
      }

      if (hash == "f18106752e62b9a5d8eb9918e6cd6943429c74b6bc68aead6a23760d023ce8fc") {
        duration = 600;
        result['title'] = "I bet I can beat you in Masters of Conquest";
      }

      console.log(duration, block.timestamp, wagerStartTimestamp);

      var timeUntilEnd = duration - (block.timestamp - wagerStartTimestamp);

      var timeUntilEndString = moment.duration(timeUntilEnd, "seconds").format("y [years], M [months], d [days], h [hours], m [minutes], s [seconds]");

      result['timeUntilEndString'] = timeUntilEndString;
      result['duration'] = duration;

      SwarmServerActions.receivedGameRules(result);
    });
  }, 1000);
}

module.exports = {
  getGamesDefault: getGamesDefault,
  getGameRulesDefault: getGameRulesDefault,
  // below functions rely on swarm howver swarm can be down
  getGamesSwarm: getGamesSwarm,
  getGameRulesSwarm: getGameRulesSwarm,

  getGames: getGamesDefault,
  getGameRules: getGameRulesDefault
};

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
  setTimeout(function() {
    if (game["hash"] == "1") {
      game["rules"] = {
        "title": "I bet I can beat you in Dota 2",
        "duration": 3600
      }
    }

    if (game["hash"] == "2") {
      game["rules"] = {
        "title": "I bet I can beat you in Counter-Strike: Global Offensive",
        "duration": 3600
      }
    }

    if (game["hash"] == "3") {
      game["rules"] = {
        "title": "I bet I can beat you in Heroes of the Storm",
        "duration": 3600
      }
    }

    if (game["hash"] == "4") {
      game["rules"] = {
        "title": "I bet I can beat you in Call of Duty: Infinite Warfare",
        "duration": 3600
      }
    }

    if (game["hash"] == "5") {
      game["rules"] = {
        "title": "I bet I can beat you in Hearthstone: Heroes of WarCraft",
        "duration": 3600
      }
    }

    if (game["hash"] == "6") {
      game["rules"] = {
        "title": "I bet I can beat you in Overwatch",
        "duration": 3600
      }
    }

    if (game["hash"] == "7") {
      game["rules"] = {
        "title": "I bet I can beat you in Halo 5: Guardians",
        "duration": 3600
      }
    }

    if (game["hash"] == "8") {
      game["rules"] = {
        "title": "I bet I can beat you in H1Z1",
        "duration": 3600
      }
    }

    if (game["hash"] == "9") {
      game["rules"] = {
        "title": "I bet I can beat you in CrossFire",
        "duration": 3600
      }
    }

    if (game["hash"] == "10") {
      game["rules"] = {
        "title": "I bet I can beat you in Quake Champions",
        "duration": 3600
      }
    }

    if (game["hash"] == "11") {
      game["rules"] = {
        "title": "I bet I can beat you in FIFA 17",
        "duration": 3600
      }
    }

    if (game["hash"] == "12") {
      game["rules"] = {
        "title": "I bet I can beat you in Rocket League",
        "duration": 3600
      }
    }

    if (game["hash"] == "13") {
      game["rules"] = {
        "title": "I bet I can beat you in Smite",
        "duration": 3600
      }
    }

    if (game["hash"] == "14") {
      game["rules"] = {
        "title": "I bet I can beat you in Street Fighter V",
        "duration": 3600
      }
    }

    if (game["hash"] == "15") {
      game["rules"] = {
        "title": "I bet I can beat you in Gears of War 4",
        "duration": 3600
      }
    }

    if (game["hash"] == "16") {
      game["rules"] = {
        "title": "I bet I can beat you in rFactor 2",
        "duration": 3600
      }
    }

    if (game["hash"] == "17") {
      game["rules"] = {
        "title": "I bet I can beat you in Madden NFL 2017",
        "duration": 3600
      }
    }

    if (game["hash"] == "d8fe3958b201c46e3d1ca6d431a11de990457f953f349705669806e514832f1e" || game["hash"] == "18") {
      game["rules"] = {
        "title": "I bet I can beat you in Starcraft",
        "duration": 3600
      }
    }

    if (game["hash"] == "980e7d2ed5d70211dcf0ed9caf1f823c648cfff5b814d1dda8f1002aeb689e13" || game["hash"] == "19") {
      game["rules"] = {
        "title": "I bet I can beat you in League of Legends",
        "duration": 3600
      }
    }

    if (game["hash"] == "f18106752e62b9a5d8eb9918e6cd6943429c74b6bc68aead6a23760d023ce8fc" || game["hash"] == "20") {
      game["rules"] = {
        "title": "I bet I can beat you in Masters of Conquest",
        "duration": 3600
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
          "duration": 3600
        }
      },
      {
        "id": 1,
        "hash": "980e7d2ed5d70211dcf0ed9caf1f823c648cfff5b814d1dda8f1002aeb689e13",
        "rules": {
          "title": "I bet I can beat you in League of Legends",
          "duration": 3600
        }
      },
      {
        "id": 2,
        "hash": "f18106752e62b9a5d8eb9918e6cd6943429c74b6bc68aead6a23760d023ce8fc",
        "rules": {
          "title": "I bet I can beat you in Masters of Conquest",
          "duration": 3600
        }
      },
      {
        "id": 3,
        "hash": "1",
        "rules": {
          "title": "I bet I can beat you in Dota 2",
          "duration": 3600
        }
      },
      {
        "id": 4,
        "hash": "2",
        "rules": {
          "title": "I bet I can beat you in Counter-Strike: Global Offensive",
          "duration": 3600
        }
      },
      {
        "id": 5,
        "hash": "3",
        "rules": {
          "title": "I bet I can beat you in Heroes of the Storm",
          "duration": 3600
        }
      },
      {
        "id": 6,
        "hash": "4",
        "rules": {
          "title": "I bet I can beat you in Call of Duty: Infinite Warfare",
          "duration": 3600
        }
      },
      {
        "id": 7,
        "hash": "5",
        "rules": {
          "title": "I bet I can beat you in Hearthstone: Heroes of WarCraft",
          "duration": 3600
        }
      },
      {
        "id": 8,
        "hash": "6",
        "rules": {
          "title": "I bet I can beat you in Overwatch",
          "duration": 3600
        }
      },
      {
        "id": 9,
        "hash": "7",
        "rules": {
          "title": "I bet I can beat you in Halo 5: Guardians",
          "duration": 3600
        }
      },
      {
        "id": 10,
        "hash": "8",
        "rules": {
          "title": "I bet I can beat you in H1Z1",
          "duration": 3600
        }
      },
      {
        "id": 11,
        "hash": "9",
        "rules": {
          "title": "I bet I can beat you in CrossFire",
          "duration": 3600
        }
      },
      {
        "id": 12,
        "hash": "10",
        "rules": {
          "title": "I bet I can beat you in Quake Champions",
          "duration": 3600
        }
      },
      {
        "id": 13,
        "hash": "11",
        "rules": {
          "title": "I bet I can beat you in FIFA 17",
          "duration": 3600
        }
      },
      {
        "id": 14,
        "hash": "12",
        "rules": {
          "title": "I bet I can beat you in Rocket League",
          "duration": 3600
        }
      },
      {
        "id": 15,
        "hash": "13",
        "rules": {
          "title": "I bet I can beat you in Smite",
          "duration": 3600
        }
      },
      {
        "id": 16,
        "hash": "14",
        "rules": {
          "title": "I bet I can beat you in Street Fighter V",
          "duration": 3600
        }
      },
      {
        "id": 17,
        "hash": "15",
        "rules": {
          "title": "I bet I can beat you in Gears of War 4",
          "duration": 3600
        }
      },
      {
        "id": 18,
        "hash": "16",
        "rules": {
          "title": "I bet I can beat you in rFactor 2",
          "duration": 3600
        }
      },
      {
        "id": 19,
        "hash": "17",
        "rules": {
          "title": "I bet I can beat you in Madden NFL 2017",
          "duration": 3600
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

      if (hash == "1") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Dota 2";
      }

      if (hash == "2") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Counter-Strike: Global Offensive";
      }

      if (hash == "3") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Heroes of the Storm";
      }

      if (hash == "4") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Call of Duty: Infinite Warfare";
      }

      if (hash == "5") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Hearthstone: Heroes of WarCraft";
      }

      if (hash == "6") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Overwatch";
      }

      if (hash == "7") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Halo 5: Guardians";
      }

      if (hash == "8") {
        duration = 3600;
        result['title'] = "I bet I can beat you in H1Z1";
      }

      if (hash == "9") {
        duration = 3600;
        result['title'] = "I bet I can beat you in CrossFire";
      }

      if (hash == "10") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Quake Champions";
      }

      if (hash == "11") {
        duration = 3600;
        result['title'] = "I bet I can beat you in FIFA 17";
      }

      if (hash == "12") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Rocket League";
      }

      if (hash == "13") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Smite";
      }

      if (hash == "14") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Street Fighter V";
      }

      if (hash == "15") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Gears of War 4";
      }

      if (hash == "16") {
        duration = 3600;
        result['title'] = "I bet I can beat you in rFactor 2";
      }

      if (hash == "17") {
        duration = 3600;
        result['title'] = "I bet I can beat you in Madden NFL 2017";
      }

      if (hash == "d8fe3958b201c46e3d1ca6d431a11de990457f953f349705669806e514832f1e" || hash == "18") {
        duration = 3600;
        result['title'] = "I bet I can beat you in StartCraft";
      }

      if (hash == "980e7d2ed5d70211dcf0ed9caf1f823c648cfff5b814d1dda8f1002aeb689e13" || hash == "19") {
        duration = 3600;
        result['title'] = "I bet I can beat you in League of Legends";
      }

      if (hash == "f18106752e62b9a5d8eb9918e6cd6943429c74b6bc68aead6a23760d023ce8fc" || hash == "20") {
        duration = 3600;
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

  // 2018/2/23
  // below functions rely on swarm however swarm can be down
  getGamesSwarm: getGamesSwarm,
  getGameRulesSwarm: getGameRulesSwarm,

  getGames: getGamesDefault,
  getGameRules: getGameRulesDefault
};

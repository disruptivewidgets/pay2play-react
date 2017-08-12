var Web3ServerActions = require('../actions/Web3ServerActions');
var request = require('superagent');

import interfaces from "../smart-contract/interfaces.js";

var registrarAddress = "0xdccd2a82cea71049b76c3824338f9af65f6515db";

function retrieveWager(index, callback) {
  var wagers = [];

  var contract = new window.web3.eth.Contract(interfaces.registrarInterface);
  contract.options.address = registrarAddress; // Ropsen Pay2Play

  contract.methods.getWager(index.toString()).call({}, function(error, result) {
    console.log(result);

    var state = "open";

    var date = new Date(result[1] * 1000);

    switch(result[0].toString()) {
      case "0":
        state = "open";
        break;
      case "1":
        state = "closed";
        break;
      case "2":
        state = "finished";
        break;
    }

    var wager = {
      index: index,
      state: state,
      date: date,
      amount: result[2].toString(),
    };

    callback(wager);
  });
}
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
}

module.exports = {
  retrieveWagers: function() {
    var contract = new window.web3.eth.Contract(interfaces.registrarInterface);
    contract.options.address = registrarAddress;

    contract.methods.getWagerCount().call({}, function(error, result) {
      var index = result - 1;

      var wagerIndices = Array.from({length: result}, (v, k) => k);
      wagerIndices.reverse();

      function sort(wagers) {
        var sorted = _.sortBy(wagers, function(wager) {
          return - (wager.date.getTime());
        });

        Web3ServerActions.retrieveWagers(sorted);
      };

      eachAsync(wagerIndices, retrieveWager, sort);
    });
  },
  retrieveWager: function(id) {

    function parse(wager) {
      Web3ServerActions.receivedWager(wager);
    }

    retrieveWager(id, parse);
    // var contract = new window.web3.eth.Contract(interfaces.registrarInterface);
    // contract.options.address = registrarAddress;
    //
    // contract.methods.getWager(id).call({}, function(error, result) {
    //   Web3ServerActions.receivedWager(result);
    // });
  },
};

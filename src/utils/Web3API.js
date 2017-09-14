var Web3ServerActions = require('../actions/Web3ServerActions');
var request = require('superagent');

// import * as moment from 'moment';
// import 'moment-duration-format';

import interfaces from "../smart-contract/interfaces.js";

var contractAddress = "0x20b4bc2c50cf618c441e08f246f283cc81a0035b"; // Ropsen Pay2Play

function retrieveWager(index, callback) {
  var wagers = [];

  var contract = new window.web3.eth.Contract(interfaces.registrarInterface);
  contract.options.address = contractAddress; // Ropsen Pay2Play

  contract.methods.getWager(index.toString()).call({}, function(error, result) {
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
      case "3":
        state = "settled";
    }

    console.log(result);

    var wager = {
      index: index,
      state: state,
      date: date,
      startTimestamp: result[1],
      amount: result[2].toString(),
      winner: result[3],
      players: result[4],
      referenceHash: result[5].substring(2)
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
    console.log("retrieveWagers");

    var contract = new window.web3.eth.Contract(interfaces.registrarInterface);
    contract.options.address = contractAddress;

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
  },
  getAccounts: function() {
    window.web3.eth.getAccounts((error, accounts) => {
      Web3ServerActions.retrieveAccounts(accounts);
    });
  },
  contractAddress: contractAddress
};

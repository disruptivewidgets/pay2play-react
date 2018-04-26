var Web3ServerActions = require('../actions/Web3ServerActions');
var request = require('superagent');

import SessionHelper from "../helpers/SessionUtils.js";

// import * as moment from 'moment';
// import 'moment-duration-format';

import interfaces from "../smart-contract/interfaces.js";

var contractAddress = ""; // Ropsen Pay2Play
var tokenContractAddress = ""; // Ropsen Pay2Play
var bracketContractAddress = "";

// 2018-03-27
tokenContractAddress = "0xe1ebf9518fd31426baad9b36cca87b80096be8ef";
contractAddress = "0xe018598af2954cb1717b2dff610e13a18587b044";
bracketContractAddress = "0x0617cd7edde2714b57ecf774a1ed2b237405b25a";

var fromBlock = '';
var toBlock = '';

function retrieveWager(index, callback) {
  var wagers = [];

  var contract = new window.web3.eth.Contract(interfaces.registrarInterface);
  contract.options.address = contractAddress; // Ropsen Pay2Play

  contract.methods.getWager(index.toString()).call({}, function(error, result)
  {
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

    var wager = {
      index: index,
      state: state,
      date: date,
      startTimestamp: result[1],
      amount: result[2].toString(),
      winner: result[3],
      players: result[4],
      referenceHash: result[5]
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
  ping: function() {
    setTimeout(function() {
      alert("Hello!");

      Web3ServerActions.ping('TEST');
    }, 3000);
  },
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
  retrieveWager: function(id)
  {

    function parse(wager)
    {
      Web3ServerActions.receivedWager(wager);
    }

    retrieveWager(id, parse);
  },
  getAccounts: function() {
    window.web3.eth.getAccounts((error, accounts) => {
      Web3ServerActions.retrieveAccounts(accounts);
    });
  },
  getSecretHash: function(address) {
    // window.web3.eth.getAccounts((error, accounts) => {
    //   Web3ServerActions.retrieveAccounts(accounts);
    // });

    window.contract.methods.secrets(address).call({}, function(error, result) {
      console.log("getSecret");
      console.log(address);
      // console.log(error, result);
      //
      // // shim.setState({
      // //   lossCount: result
      // // });
      //

      Web3ServerActions.getSecretHash(result);
    });
  },
  startWager: function(referenceHash, params) {
    console.log("startWager");

    window.contract.methods.createWagerAndDeposit(referenceHash).send(params)
    .on('transactionHash', function(hash) {
      console.log("transactionHash");
      console.log("txid: " + hash);

      var transaction = {
        id: hash,
        status: "pending_block",
        type: "start",
        wagerId: -1
      }

      SessionHelper.storeTransaction(transaction);
      SessionHelper.listTransactions();

      Web3ServerActions.startWager('transactionHash');
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log("confirmation: " + confirmationNumber);
      console.log(receipt);

      if (confirmationNumber == 0) {
        var events = receipt.events;

        var wagerId = events.WagerStarted.returnValues.index;

        console.log("wagerId: " + wagerId);

        var hash = receipt.transactionHash;

        SessionHelper.updateTransaction(hash, "status", "pending_start_receipt_review");
        SessionHelper.updateTransaction(hash, "wagerId", wagerId);
        SessionHelper.listTransactions();

        // //
        // window.component.setState({
        //   loaded: true,
        //   processing: true
        // });
        // //

        Web3ServerActions.startWager('confirmation');
      }
    })
    .on('receipt', function(receipt) {
      console.log("receipt");
      console.log(receipt)

      Web3ServerActions.startWager('receipt');
    })
    .on('error', function(error) {
      console.log("error");
      console.error(error);

      // //
      // window.component.setState({
      //   loaded: true
      // });
      //
      // window.component.forceUpdate();
      // //

      Web3ServerActions.startWager('error');
    });
  },
  counterWagerAndDeposit: function(wagerId, params) {

    window.contract.methods.counterWagerAndDeposit(wagerId).send(params)
    .on('transactionHash', function(hash) {
      console.log("transactionHash");
      console.log("txid: " + hash);

      SessionHelper.removeTransaction("wagerId", wagerId);

      var transaction = {
        id: hash,
        status: "pending_block",
        type: "counter",
        wagerId: wagerId
      }

      SessionHelper.storeTransaction(transaction);
      SessionHelper.listTransactions();

      Web3ServerActions.counterWagerAndDeposit('transactionHash');
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log("confirmation: " + confirmationNumber);
      console.log(receipt);

      if (confirmationNumber == 0) {
        var hash = receipt.transactionHash;

        SessionHelper.updateTransaction(hash, "status", "pending_counter_receipt_review");
        SessionHelper.listTransactions();

        // window.component.setState({
        //   loaded: true,
        //   processing: true
        // });

        Web3ServerActions.counterWagerAndDeposit('confirmation');
      }
    })
    .on('receipt', function(receipt) {
      console.log("receipt");
      console.log(receipt)

      Web3ServerActions.counterWagerAndDeposit('receipt');
    })
    .on('error', function(error) {
      console.log("error");
      console.error(error);

      // window.component.setState({
      //   loaded: true
      // });
      //
      // window.component.forceUpdate();

      Web3ServerActions.counterWagerAndDeposit('error');
    });
  },
  setWagerWinner: function(wagerId, winner, params) {
    console.log("setWagerWinner");

    window.contract.methods.setWagerWinner(wagerId, winner).send(params)
    .on('transactionHash', function(hash) {
      console.log("transactionHash");
      console.log("txid: " + hash);

      SessionHelper.removeTransaction("wagerId", wagerId);

      var transaction = {
        id: hash,
        status: "pending_block",
        type: "wager_winner",
        wagerId: wagerId
      }

      SessionHelper.storeTransaction(transaction);
      SessionHelper.listTransactions();

      Web3ServerActions.setWagerWinner('transactionHash');
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log("confirmation: " + confirmationNumber);
      console.log(receipt);

      if (confirmationNumber == 0) {
        var hash = receipt.transactionHash;

        SessionHelper.updateTransaction(hash, "status", "pending_winner_receipt_review");
        SessionHelper.listTransactions();

        // window.component.setState({
        //   loaded: true,
        //   processing: true
        // });

        Web3ServerActions.setWagerWinner('confirmation');
      }
    })
    .on('receipt', function(receipt) {
      console.log("receipt");
      console.log(receipt)

      Web3ServerActions.setWagerWinner('receipt');
    })
    .on('error', function(error) {
      console.log("error");
      console.error(error);

      // window.component.setState({
      //   loaded: true
      // });
      //
      // window.component.forceUpdate();

      Web3ServerActions.setWagerWinner('error');
    });
  },
  withdrawWinnings: function(wagerId, params) {
    console.log("withdrawWinnings");

    window.contract.methods.withdrawWinnings(wagerId).send(params)
    .on('transactionHash', function(hash) {
      console.log("transactionHash");
      console.log("txid: " + hash);

      SessionHelper.removeTransaction("wagerId", wagerId);

      var transaction = {
        id: hash,
        status: "pending_block",
        type: "withdrawal",
        wagerId: wagerId
      }

      SessionHelper.storeTransaction(transaction);
      SessionHelper.listTransactions();

      Web3ServerActions.withdrawWinnings('transactionHash');
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log("confirmation: " + confirmationNumber);
      console.log(receipt);

      if (confirmationNumber == 0) {
        var hash = receipt.transactionHash;

        SessionHelper.updateTransaction(hash, "status", "pending_withrawal_receipt_review");
        SessionHelper.listTransactions();

        // window.component.setState({
        //   loaded: true,
        //   processing: true
        // });

        Web3ServerActions.withdrawWinnings('confirmation');
      }
    })
    .on('receipt', function(receipt) {
      console.log("receipt");
      console.log(receipt);

      Web3ServerActions.withdrawWinnings('receipt');
    })
    .on('error', function(error) {
      console.log("error");
      console.error(error);
      console.log(error.name);
      console.log(error.message);

      // window.component.setState({
      //   loaded: true
      // });
      //
      // window.component.forceUpdate();

      Web3ServerActions.withdrawWinnings('error');
    });
  },
  setSecret: function(secret, params) {
    console.log("setSecret");

    window.contract.methods.setSecret(secret).send(params)
    .on('transactionHash', function(hash) {
      console.log("transactionHash");
      console.log("txid: " + hash);

      Web3ServerActions.setSecret('transactionHash');
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log("confirmation: " + confirmationNumber);
      console.log(receipt);

      if (confirmationNumber == 0) {
        var hash = receipt.transactionHash;

        Web3ServerActions.setSecret('confirmation');
      }
    })
    .on('receipt', function(receipt) {
      console.log("receipt");
      console.log(receipt)

      Web3ServerActions.setSecret('receipt');
    })
    .on('error', function(error) {
      console.log("error");
      console.error(error);

      Web3ServerActions.setSecret('error');
    });
  },
  // BRACKET
  getSeats_SideA: function() {
    console.log("getSeats_SideA");

    var contract = new window.web3.eth.Contract(interfaces.bracketInterface);
    contract.options.address = bracketContractAddress;

    contract.methods.getSeats_SideA().call({}, function(error, result) {
      console.log(result);

      Web3ServerActions.getSeats_SideA(result);
    });
  },
  getSeats_SideB: function() {
    console.log("getSeats_SideB");

    var contract = new window.web3.eth.Contract(interfaces.bracketInterface);
    contract.options.address = bracketContractAddress;

    contract.methods.getSeats_SideB().call({}, function(error, result) {
      console.log(result);

      Web3ServerActions.getSeats_SideB(result);
    });
  },
  takeSeat_SideA: function(index, params) {
    console.log("takeSeat_SideA: " + index);

    window.bracketContract.methods.join_SideA(index).send(params)
    .on('transactionHash', function(hash) {
      console.log("transactionHash");
      console.log("txid: " + hash);
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log("confirmation: " + confirmationNumber);
      console.log(receipt);

      if (confirmationNumber == 0) {

      }
    })
    .on('receipt', function(receipt) {
      console.log("receipt");
      console.log(receipt)
    })
    .on('error', function(error) {
      console.log("error");
      console.error(error);
    });
  },
  takeSeat_SideB: function(index, params) {
    console.log("takeSeat_SideB: " + index);

    window.bracketContract.methods.join_SideB(index).send(params)
    .on('transactionHash', function(hash) {
      console.log("transactionHash");
      console.log("txid: " + hash);
    })
    .on('confirmation', function(confirmationNumber, receipt) {
      console.log("confirmation: " + confirmationNumber);
      console.log(receipt);

      if (confirmationNumber == 0) {

      }
    })
    .on('receipt', function(receipt) {
      console.log("receipt");
      console.log(receipt)
    })
    .on('error', function(error) {
      console.log("error");
      console.error(error);
    });
  },
  contractAddress: contractAddress,
  tokenContractAddress: tokenContractAddress,
  bracketContractAddress: bracketContractAddress
};

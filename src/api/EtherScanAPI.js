var request = require('superagent');

import util from 'ethereumjs-util';

import EventLogServerActions from '../actions/EventLogServerActions';
import { wagerRegistrarContractAddress } from '../api/Web3API';

module.exports = {
  findItems: function(query) {
    request.post('')
      .send({query: query})
      .set('Accept', 'application/json')
      .end(function(err, response) {
        if (err) return console.error(err);

        // SearchServerActions.receiveSearchResults(response.body);
      });
  },
  pullEventLogs: function(key, index) {
    var events = {
      "WagerStarted": "0x99e93bdf4e5e9e4c68adb4d59aad07663b01de88698e7e959f43a399c1df17ce",
      "WagerCountered": "0xd1376ccb0572145de3cc74ed98331a186633521b6f3ee2b95fc7f93469748f71",
      "NewDeposit": "0x0f71a8c7324cbf9513d2e403af7722f651d3635066eca540f17fb66a43fd2fa0",
      "WagerWinnerUpdated": "0x8cc07436b787fa8a30ca1402a2867cf1b592be47c9f6be3709cf2dba53dc83df",
      "WinningsWithdrawn": "0x9f1f3144430cc9624860cf28da61318e428f6d15f17e420c04e8203581951a91"
    };

    // var registrarAddress = "0x812d7c22103a243072dfcf0f60acee1eda171a29";
    var address = wagerRegistrarContractAddress;

    var topic0 = events[key];

    var topic1 = util.bufferToHex(util.setLengthLeft(parseInt(index), 32));

    var url = "https://ropsten.etherscan.io/api?module=logs&action=getLogs&fromBlock=0&toBlock=pending&address=" + address + "&topic0=" + topic0 + "&topic0_1_opr=and" + "&topic1\=" + topic1;

    console.log(url);

    request.get(url)
    .set('Accept', 'application/json')
    .end(function(error, response) {
      if (error) {
        console.error(error);
        return;
      }

      if (response.statusCode == 200) {
        var result = JSON.parse(response.text).result;
        console.log(result);

        var data = {
          transactions: result,
          topic: key
        }
        EventLogServerActions.receivedLogs(data);
      }
    });
  },
  pullTransaction: function(txid, callback) {
    var url = "https://ropsten.etherscan.io/tx/" + txid;

    console.log(url);

    request.get(url)
    .set('Accept', 'application/json')
    .end(function(error, response) {
      if (error) {
        console.error(error);
        return;
      }

      if (response.statusCode == 200) {
        var result = JSON.parse(response.text).result;
        console.log(result);

        callback(result)
      }
    });
  }
};

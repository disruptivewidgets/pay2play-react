var request = require('superagent');

import util from 'ethereumjs-util';

import EventLogServerActions from '../actions/EventLogServerActions';

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
      "WagerStarted": "0x52b3086eb00fd2639eeb5190527da3e1c4c1400ee550073dde793315159cfe77",
      "NewDeposit": "0xe6d83b1e0e5126a0574d0154ed77e40181534edcb74f035b158d92ed3d10a030",
      "WagerWinnerUpdated": "0x8cc07436b787fa8a30ca1402a2867cf1b592be47c9f6be3709cf2dba53dc83df",
      "WinningsWithdrawn": "0x9f1f3144430cc9624860cf28da61318e428f6d15f17e420c04e8203581951a91"
    };

    var registrarAddress = "0xdccd2a82cea71049b76c3824338f9af65f6515db";
    var address = registrarAddress;

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

        console.log("YO YO YO");

        var data = {
          transactions: result,
          topic: key
        }
        EventLogServerActions.receivedLogs(data);
      }
    });
  }
};

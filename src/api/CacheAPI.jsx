var CacheServerActions = require('../actions/CacheServerActions');
import SessionHelper from "../helpers/SessionUtils.js";

var request = require('superagent');

module.exports = {
  getTransactions: function() {
    console.log("getTransactions");

    CacheServerActions.receivedTransactions(SessionHelper.getTransactions());
  },
};

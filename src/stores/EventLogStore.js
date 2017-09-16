import AppDispatcher from '../dispatcher/AppDispatcher';
import EventLogActionTypes from '../constants/EventLogActionTypes';

import EventLog from '../data/EventLog';
import EventLogCounter from '../data/EventLogCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  list: [],
  data: {}
};

var EventLogStore = ObjectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  getDataStore: function() {
    return _store;
  },

  getData: function() {
    return _store.data
  },

  getTransaction: function(wagerId) {
    console.log("getTransaction");

    var logs = _store.data["WagerStarted"];

    console.log(logs);

    if (logs) {
      var log = _.findWhere(logs, {wagerId: wagerId});

      console.log("LOG LOG");
      console.log(log);
    }

  }
});

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch(action.actionType) {
    case EventLogActionTypes.PULL_EVENT_LOGS_RESPONSE:

        console.log(action.response);

        var transactions = action.response.transactions;
        var topicKey = action.response.topic;

        var eventLogs = _.map(transactions, function(transaction) {

          const id = EventLogCounter.increment();

          console.log("transaction");

          var wagerId = 0;

          if (topicKey == "WagerStarted") {
            var topics = transaction.topics;
            var topic = topics[1];

            wagerId = window.web3.utils.hexToNumber(topic);
          }

          return new EventLog({
            id,
            topic: topicKey,
            txid: transaction.transactionHash,
            wagerId: wagerId
          })
        });

        _store.list = eventLogs;
        _store.data[topicKey] = eventLogs;

        EventLogStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = EventLogStore;

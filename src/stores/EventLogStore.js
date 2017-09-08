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
  }
});

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch(action.actionType) {
    case EventLogActionTypes.PULL_EVENT_LOGS_RESPONSE:

        console.log(action.response);

        var transactions = action.response.transactions;
        var topic = action.response.topic;

        var eventLogs = _.map(transactions, function(transaction) {

          const id = EventLogCounter.increment();

          return new EventLog({
            id,
            topic: topic,
            transactionHash: transaction.transactionHash
          })
        });

        _store.list = eventLogs;
        _store.data[topic] = eventLogs;

        EventLogStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = EventLogStore;

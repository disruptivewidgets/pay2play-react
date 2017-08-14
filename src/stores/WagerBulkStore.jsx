import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';

import Wager from '../data/Wager';
import WagerCounter from '../data/WagerCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  list: []
};

var WagerBulkStore = ObjectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  getList: function() {
    return _store;
  }
});

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch(action.actionType) {
    case Web3ActionTypes.RETRIEVE_WAGERS_RESPONSE:

        var wagers = _.map(action.response, function(wager) {

          const id = WagerCounter.increment();

          return new Wager({
            id,
            index: wager.index,
            state: wager.state,
            date: wager.date.toString(),
            startTimestamp: wager.startTimestamp,
            amount: wager.amount,
            referenceHash: wager.referenceHash
          })
        });

        _store.list = wagers;

        WagerBulkStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = WagerBulkStore;

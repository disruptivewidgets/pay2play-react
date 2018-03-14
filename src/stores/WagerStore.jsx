import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';

import Wager from '../data/Wager';
import WagerCounter from '../data/WagerCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  wager: {}
};

var WagerStore = ObjectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  get: function() {
    return _store;
  }
});

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch(action.actionType) {
    case Web3ActionTypes.RETRIEVE_WAGER_RESPONSE:

        const id = WagerCounter.increment();

        var wager = new Wager({
          id,
          index: action.response.index,
          state: action.response.state,
          date: action.response.date.toString(),
          startTimestamp: action.response.startTimestamp,
          amount: action.response.amount,
          referenceHash: action.response.referenceHash,
          winner: action.response.winner,
          players: action.response.players
        })

        _store.wager = wager;

        WagerStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = WagerStore;

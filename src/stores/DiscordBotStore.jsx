import AppDispatcher from '../dispatcher/AppDispatcher';

import DiscordBotActionTypes from '../constants/DiscordBotActionTypes'

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

const CHANGE_EVENT = 'CHANGE_EVENT';

const RETRIEVE_PLAYERS = 'RETRIEVE_PLAYERS';
const NOTIFY_BUY_IN = 'NOTIFY_BUY_IN';
const NOTIFY_COUNTER = 'NOTIFY_COUNTER';

var _store = {
  accounts: []
};

var _game = {};

var DiscordBotStore = ObjectAssign({}, EventEmitter.prototype, {

  //
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  addRetrievePlayersListener: function(cb) {
    this.on(RETRIEVE_PLAYERS, cb);
  },

  removeRetrievePlayersListener: function(cb) {
    this.removeListener(RETRIEVE_PLAYERS, cb);
  },

  addNotifyBuyinListener: function(cb) {
    this.on(NOTIFY_BUY_IN, cb);
  },

  removeNotifyBuyinListener: function(cb) {
    this.removeListener(NOTIFY_BUY_IN, cb);
  },

  addNotifyCounterListener: function(cb) {
    this.on(NOTIFY_COUNTER, cb);
  },

  removeNotifyCounterListener: function(cb) {
    this.removeListener(NOTIFY_COUNTER, cb);
  },

  getStore: function() {
    return _store;
  }
});

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch(action.actionType) {
    case DiscordBotActionTypes.RETRIEVE_PLAYERS_RESPONSE:
      console.log("RETRIEVE_PLAYERS_RESPONSE");
      console.log(action.response);

      // _store.accounts = action.response;

      DiscordBotStore.emit(RETRIEVE_PLAYERS);
      break;

    case DiscordBotActionTypes.NOTIFY_BUY_IN_RESPONSE:
      console.log("NOTIFY_BUY_IN_RESPONSE");
      console.log(action.response);

      DiscordBotStore.emit(NOTIFY_BUY_IN);
      break;

    case DiscordBotActionTypes.NOTIFY_COUNTER_RESPONSE:
      console.log("NOTIFY_COUNTER_RESPONSE");
      console.log(action.response);

      DiscordBotStore.emit(NOTIFY_COUNTER);
      break;

    case DiscordBotActionTypes.PING:
      console.log("PING");

      DiscordBotStore.emit(CHANGE_EVENT);
      break;

    default:
      return true;
  }
});

module.exports = DiscordBotStore;

import AppDispatcher from '../dispatcher/AppDispatcher';

import Web3ActionTypes from '../constants/Web3ActionTypes'

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  accounts: []
};

var _game = {};

var Web3Store = ObjectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  getStore: function() {
    return _store;
  }
});

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch(action.actionType) {
    case Web3ActionTypes.RETRIEVE_ACCOUNTS_RESPONSE:

        console.log(action.response);

        _store.accounts = action.response;

        Web3Store.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = Web3Store;

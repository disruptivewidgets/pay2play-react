import AppDispatcher from '../dispatcher/AppDispatcher';

import Web3ActionTypes from '../constants/Web3ActionTypes'

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var EVENT_TXN_HASH = 'transactionHash';
var EVENT_CONFIRMATION = 'confirmation';
var EVENT_RECEIPT = 'receipt';
var EVENT_ERROR = 'error';
var SECRET_HASH = 'secretHash';

var _store = {
  accounts: []
};

var _game = {};

var Web3Store = ObjectAssign({}, EventEmitter.prototype, {

  //
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  // EVENT_TXN_HASH
  addTransactionHashListener: function(cb) {
    this.on(EVENT_TXN_HASH, cb);
  },

  removeTransactionHashListener: function(cb) {
    this.removeListener(EVENT_TXN_HASH, cb);
  },
  // EVENT_TXN_HASH

  // EVENT_CONFIRMATION
  addConfirmationListener: function(cb) {
    this.on(EVENT_CONFIRMATION, cb);
  },

  removeConfirmationListener: function(cb) {
    this.removeListener(EVENT_CONFIRMATION, cb);
  },
  // EVENT_CONFIRMATION

  // EVENT_RECEIPT
  addReceiptListener: function(cb) {
    this.on(EVENT_RECEIPT, cb);
  },

  removeReceiptListener: function(cb) {
    this.removeListener(EVENT_RECEIPT, cb);
  },
  // EVENT_RECEIPT

  // EVENT_ERROR
  addErrorListener: function(cb) {
    this.on(EVENT_ERROR, cb);
  },

  removeErrorListener: function(cb) {
    this.removeListener(EVENT_ERROR, cb);
  },
  // EVENT_ERROR

  // SECRET_HASH
  addSecretHashListener: function(cb) {
    this.on(SECRET_HASH, cb);
  },

  removeSecretHashListener: function(cb) {
    this.removeListener(SECRET_HASH, cb);
  },
  // SECRET_HASH

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
    case Web3ActionTypes.START_WAGER_RESPONSE:
      console.log("START_WAGER_RESPONSE");
      console.log(action.response);

      switch(action.response) {
        case 'transactionHash':
          Web3Store.emit(EVENT_TXN_HASH);
          break;
        case 'confirmation':
          Web3Store.emit(EVENT_CONFIRMATION);
          break;
        case 'receipt':
          Web3Store.emit(EVENT_RECEIPT);
          break;
        case 'error':
          Web3Store.emit(EVENT_ERROR);
          break;
      }
      break;
    case Web3ActionTypes.COUNTER_WAGER_AND_DEPOSIT_RESPONSE:
      console.log("COUNTER_WAGER_AND_DEPOSIT_RESPONSE");
      console.log(action.response);

      switch(action.response) {
        case 'transactionHash':
          Web3Store.emit(EVENT_TXN_HASH);
          break;
        case 'confirmation':
          Web3Store.emit(EVENT_CONFIRMATION);
          break;
        case 'receipt':
          Web3Store.emit(EVENT_RECEIPT);
          break;
        case 'error':
          Web3Store.emit(EVENT_ERROR);
          break;
      }
      break;
    case Web3ActionTypes.SET_WAGER_WINNER_RESPONSE:
      console.log("SET_WAGER_WINNER_RESPONSE");
      console.log(action.response);

      switch(action.response) {
        case 'transactionHash':
          Web3Store.emit(EVENT_TXN_HASH);
          break;
        case 'confirmation':
          Web3Store.emit(EVENT_CONFIRMATION);
          break;
        case 'receipt':
          Web3Store.emit(EVENT_RECEIPT);
          break;
        case 'error':
          Web3Store.emit(EVENT_ERROR);
          break;
      }
      break;
    case Web3ActionTypes.WITHDRAW_WINNINGS_RESPONSE:
      console.log("WITHDRAW_WINNINGS_RESPONSE");
      console.log(action.response);

      switch(action.response) {
        case 'transactionHash':
          Web3Store.emit(EVENT_TXN_HASH);
          break;
        case 'confirmation':
          Web3Store.emit(EVENT_CONFIRMATION);
          break;
        case 'receipt':
          Web3Store.emit(EVENT_RECEIPT);
          break;
        case 'error':
          Web3Store.emit(EVENT_ERROR);
          break;
      }
      break;
    case Web3ActionTypes.SET_SECRET_RESPONSE:
      console.log("SET_SECRET_RESPONSE");
      console.log(action.response);

      switch(action.response) {
        case 'transactionHash':
          Web3Store.emit(EVENT_TXN_HASH);
          break;
        case 'confirmation':
          Web3Store.emit(EVENT_CONFIRMATION);
          break;
        case 'receipt':
          Web3Store.emit(EVENT_RECEIPT);
          break;
        case 'error':
          Web3Store.emit(EVENT_ERROR);
          break;
      }
      break;
    case Web3ActionTypes.GET_SECRET_HASH_RESPONSE:
      console.log("GET_SECRET_HASH_RESPONSE");
      console.log(action.response);

      window.secretHash = action.response;

      Web3Store.emit(SECRET_HASH);
      // switch(action.response) {
      //   case 'transactionHash':
      //     Web3Store.emit(EVENT_TXN_HASH);
      //     break;
      //   case 'confirmation':
      //     Web3Store.emit(EVENT_CONFIRMATION);
      //     break;
      //   case 'receipt':
      //     Web3Store.emit(EVENT_RECEIPT);
      //     break;
      //   case 'error':
      //     Web3Store.emit(EVENT_ERROR);
      //     break;
      // }
      break;
    case Web3ActionTypes.PING:
      console.log("PING");

      Web3Store.emit(CHANGE_EVENT);
      break;
    default:
      return true;
  }
});

module.exports = Web3Store;

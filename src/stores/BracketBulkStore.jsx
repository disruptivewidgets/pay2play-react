import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';

import Bracket from '../data/Bracket';
import BracketCounter from '../data/BracketCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var EVENT_TXN_HASH = 'transactionHash';
var EVENT_CONFIRMATION = 'confirmation';
var EVENT_RECEIPT = 'receipt';
var EVENT_ERROR = 'error';

var _store =
{
  list: []
};

var BracketBulkStore = ObjectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  // TRANSACTION LISTENERS
  // EVENT_TXN_HASH
  addTransactionHashListener: function(cb)
  {
    this.on(EVENT_TXN_HASH, cb);
  },

  removeTransactionHashListener: function(cb)
  {
    this.removeListener(EVENT_TXN_HASH, cb);
  },
  // EVENT_TXN_HASH

  // EVENT_CONFIRMATION
  addConfirmationListener: function(cb)
  {
    this.on(EVENT_CONFIRMATION, cb);
  },

  removeConfirmationListener: function(cb)
  {
    this.removeListener(EVENT_CONFIRMATION, cb);
  },
  // EVENT_CONFIRMATION

  // EVENT_RECEIPT
  addReceiptListener: function(cb)
  {
    this.on(EVENT_RECEIPT, cb);
  },

  removeReceiptListener: function(cb)
  {
    this.removeListener(EVENT_RECEIPT, cb);
  },
  // EVENT_RECEIPT

  // EVENT_ERROR
  addErrorListener: function(cb)
  {
    this.on(EVENT_ERROR, cb);
  },

  removeErrorListener: function(cb)
  {
    this.removeListener(EVENT_ERROR, cb);
  },
  // EVENT_ERROR
  // TRANSACTION LISTENERS

  getList: function() {
    return _store;
  }
});

AppDispatcher.register(function(payload)
{
  var action = payload.action;

  switch(action.actionType)
  {
    case Web3ActionTypes.START_BRACKET_RESPONSE:

      switch(action.response)
      {
        case 'transactionHash':
          BracketBulkStore.emit(EVENT_TXN_HASH);
          break;
        case 'confirmation':
          BracketBulkStore.emit(EVENT_CONFIRMATION);
          break;
        case 'receipt':
          BracketBulkStore.emit(EVENT_RECEIPT);
          break;
        case 'error':
          BracketBulkStore.emit(EVENT_ERROR);
          break;
      }

      break;
    case Web3ActionTypes.RETRIEVE_BRACKETS_RESPONSE:

        var brackets = _.map(action.response, function(bracket)
        {

          const id = BracketCounter.increment();
          console.log(bracket);
          return new Bracket({
            id,
            index: bracket.index,
            startTimestamp: bracket.date.toString(),
            playerCount: bracket.playerCount,
            winner: bracket.winner,
            owner: bracket.owner,
            seats: []
          })
        });

        _store.list = brackets;

        BracketBulkStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = BracketBulkStore;

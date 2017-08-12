import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';

import Transaction from '../data/Transaction';
import TransactionCounter from '../data/TransactionCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  list: []
};

var TransactionStore = ObjectAssign({}, EventEmitter.prototype, {

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
    case Web3ActionTypes.RETRIEVE_ORDERS_RESPONSE:

        var transactions = _.map(action.response, function(transaction) {

          const id = TransactionCounter.increment();

          return new Transaction({
            id,
            index: transaction.index,
            state: transaction.state,
            date: transaction.date.toString(),
            amount: transaction.amount,
            referenceHash: transaction.referenceHash
          })
        });

        _store.list = transactions;

        TransactionStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = TransactionStore;

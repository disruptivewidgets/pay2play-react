import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';

import Bracket from '../data/Bracket';
import BracketCounter from '../data/BracketCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  list: []
};

var BracketBulkStore = ObjectAssign({}, EventEmitter.prototype, {

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

AppDispatcher.register(function(payload)
{

  console.log("D");

  var action = payload.action;

  switch(action.actionType)
  {
    case Web3ActionTypes.RETRIEVE_BRACKETS_RESPONSE:

        var brackets = _.map(action.response, function(bracket)
        {

          const id = BracketCounter.increment();
          console.log(bracket);
          return new Bracket({
            id,
            index: bracket.index,
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

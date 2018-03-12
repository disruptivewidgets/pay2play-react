import AppDispatcher from '../dispatcher/AppDispatcher';
import CacheActionTypes from '../constants/CacheActionTypes';

import CacheRecord from '../data/CacheRecord';
import CacheRecordCounter from '../data/CacheRecordCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

import * as moment from 'moment';
import 'moment-duration-format';

var _store = {
  list: []
};

var CacheStore = ObjectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  getDataStore: function() {
    return _store;
  }
});

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch(action.actionType) {
    case CacheActionTypes.GET_TRANSACTIONS_RESPONSE:

        console.log(action.response);

        var cacheRecords = _.map(action.response, function(cacheRecord) {

          const id = CacheRecordCounter.increment();

          return new CacheRecord({
            id,
            txnId: cacheRecord.id,
            status: cacheRecord.status,
            type: cacheRecord.type,
            wagerId: cacheRecord.wagerId
          })
        });

        _store.list = cacheRecords;

        CacheStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = CacheStore;

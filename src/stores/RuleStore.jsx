import AppDispatcher from '../dispatcher/AppDispatcher';
import GameActionTypes from '../constants/GameActionTypes';

import Rule from '../data/Rule';
import RuleCounter from '../data/RuleCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

import * as moment from 'moment';
import 'moment-duration-format';

var _store = {
  list: [],
  rules: {}
};

var RuleStore = ObjectAssign({}, EventEmitter.prototype, {

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
    case GameActionTypes.RETRIEVE_GAME_RULES_RESPONSE:

        console.log(action.response);

        var rules = action.response;

        const id = RuleCounter.increment();

        var timeframe = moment.duration(rules.duration, "seconds").format("y [years], M [months], d [days], h [hours], m [minutes], s [seconds]");

        _store.rules = new Rule({
           id,
           referenceHash: '',
           duration: rules.duration,
           rule: timeframe,
           title: rules.title,
           timeUntilEndString: rules.timeUntilEndString
         });

        RuleStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = RuleStore;

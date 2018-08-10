import AppDispatcher from '../dispatcher/AppDispatcher';
import GameRulesActionTypes from '../constants/GameRulesActionTypes';

import GameRule from '../data/GameRule';
import GameRuleCounter from '../data/GameRuleCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

import * as moment from 'moment';
import 'moment-duration-format';

var _store = {
  list: [],
  game: {}
};

var _game = {};

var GameRulesStore = ObjectAssign({}, EventEmitter.prototype, {

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
    case GameRulesActionTypes.RETRIEVE_GAME_RULES_RESPONSE:

        console.log(action.response);

        var games = _.map(action.response, function(game) {

          const id = GameRuleCounter.increment();

          var timeframe = moment.duration(game.rules.duration, "seconds").format("y [years], M [months], d [days], h [hours], m [minutes], s [seconds]");

          return new GameRule({
            id,
            index: game.id,
            referenceHash: game.hash,
            duration: game.rules.duration,
            timeframe: timeframe,
            title: game.rules.title,
          })
        });

        _store.list = games;

        GameRulesStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = GameRulesStore;

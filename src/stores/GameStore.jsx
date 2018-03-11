import AppDispatcher from '../dispatcher/AppDispatcher';
import GameActionTypes from '../constants/GameActionTypes';

import Game from '../data/Game';
import GameCounter from '../data/GameCounter';

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

var GameStore = ObjectAssign({}, EventEmitter.prototype, {

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
    case GameActionTypes.RETRIEVE_GAMES_RESPONSE:

        console.log(action.response);

        var games = _.map(action.response, function(game) {

          const id = GameCounter.increment();

          var timeframe = moment.duration(game.rules.duration, "seconds").format("y [years], M [months], d [days], h [hours], m [minutes], s [seconds]");

          return new Game({
            id,
            index: game.id,
            referenceHash: game.hash,
            duration: game.rules.duration,
            timeframe: timeframe,
            title: game.rules.title,
          })
        });

        _store.list = games;

        GameStore.emit(CHANGE_EVENT);
        break;
    default:
      return true;
  }
});

module.exports = GameStore;

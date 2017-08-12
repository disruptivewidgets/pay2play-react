import AppDispatcher from '../dispatcher/AppDispatcher';
import SwarmActionTypes from '../constants/SwarmActionTypes';

import Game from '../data/Game';
import GameCounter from '../data/GameCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var _store = {
  list: []
};

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
    case SwarmActionTypes.RETRIEVE_GAMES_RESPONSE:

        console.log(action.response);

        var games = _.map(action.response, function(game) {

          const id = GameCounter.increment();

          return new Game({
            id,
            index: game.id,
            referenceHash: game.hash,
            duration: game.rules.duration,
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

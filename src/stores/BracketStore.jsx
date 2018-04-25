import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';

import Bracket from '../data/Bracket';
import BracketCounter from '../data/BracketCounter';

import _ from 'lodash'

var ObjectAssign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE_EVENT = 'change';

var FETCH_SEATS_SIDE_A = 'FETCH_SEATS_SIDE_A';
var FETCH_SEATS_SIDE_B = 'FETCH_SEATS_SIDE_B';

var _store = {
  seats_SideA: [],
  seats_SideB: []
};

var BracketStore = ObjectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  addFetchSeatsSideAListener: function(cb) {
    this.on(FETCH_SEATS_SIDE_A, cb);
  },

  removeFetchSeatsSideAListener: function(cb) {
    this.removeListener(FETCH_SEATS_SIDE_A, cb);
  },

  addFetchSeatsSideBListener: function(cb) {
    this.on(FETCH_SEATS_SIDE_B, cb);
  },

  removeFetchSeatsSideBListener: function(cb) {
    this.removeListener(FETCH_SEATS_SIDE_B, cb);
  },

  getList: function() {
    return _store;
  },

  getSeats_SideA: function() {
    return _store.seats_SideA;
  },

  getSeats_SideB: function() {
    return _store.seats_SideB;
  }

});

AppDispatcher.register(function(payload) {

  var action = payload.action;

  switch(action.actionType) {
    case Web3ActionTypes.GET_SEATS_SIDE_A_RESPONSE:

        // var wagers = _.map(action.response, function(wager) {
        //
        //   const id = WagerCounter.increment();
        //
        //   return new Wager({
        //     id,
        //     index: wager.index,
        //     state: wager.state,
        //     date: wager.date.toString(),
        //     startTimestamp: wager.startTimestamp,
        //     amount: wager.amount,
        //     players: wager.players,
        //     referenceHash: wager.referenceHash
        //   })
        // });
        //
        // _store.list = wagers;

        _store.seats_SideA = action.response;
        console.log("A");
        BracketStore.emit(FETCH_SEATS_SIDE_A);
        break;
    case Web3ActionTypes.GET_SEATS_SIDE_B_RESPONSE:

        // var wagers = _.map(action.response, function(wager) {
        //
        //   const id = WagerCounter.increment();
        //
        //   return new Wager({
        //     id,
        //     index: wager.index,
        //     state: wager.state,
        //     date: wager.date.toString(),
        //     startTimestamp: wager.startTimestamp,
        //     amount: wager.amount,
        //     players: wager.players,
        //     referenceHash: wager.referenceHash
        //   })
        // });
        //
        // _store.list = wagers;

        _store.seats_SideB = action.response;
        console.log("B");
        BracketStore.emit(FETCH_SEATS_SIDE_B);
        break;
    default:
      return true;
  }
});

module.exports = BracketStore;

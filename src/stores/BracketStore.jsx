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

var EVENT_TXN_HASH = 'transactionHash';
var EVENT_CONFIRMATION = 'confirmation';
var EVENT_RECEIPT = 'receipt';
var EVENT_ERROR = 'error';

var _store =
{
  seats_SideA: [],
  seats_SideB: [],
  playerCount: 32,
  bracketWinner: '',
  bracketOwner: ''
};

var BracketStore = ObjectAssign({}, EventEmitter.prototype, {

  addChangeListener: function(cb)
  {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function(cb)
  {
    this.removeListener(CHANGE_EVENT, cb);
  },

  addFetchSeatsSideAListener: function(cb)
  {
    this.on(FETCH_SEATS_SIDE_A, cb);
  },

  removeFetchSeatsSideAListener: function(cb)
  {
    this.removeListener(FETCH_SEATS_SIDE_A, cb);
  },

  addFetchSeatsSideBListener: function(cb)
  {
    this.on(FETCH_SEATS_SIDE_B, cb);
  },

  removeFetchSeatsSideBListener: function(cb)
  {
    this.removeListener(FETCH_SEATS_SIDE_B, cb);
  },

  // TRANSACTION LISTENING
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
  // TRANSACTION LISTENING

  getPlayerCount: function()
  {
    return _store.playerCount;
  },

  getBracketWinner: function()
  {
    return _store.bracketWinner;
  },

  getBracketOwner: function()
  {
    return _store.bracketOwner;
  },

  getList: function()
  {
    return _store;
  },

  getSeats_SideA: function()
  {
    return _store.seats_SideA;
  },

  getSeats_SideB: function()
  {
    return _store.seats_SideB;
  }

});

AppDispatcher.register(function(payload)
{
  var action = payload.action;

  switch(action.actionType)
  {
    case Web3ActionTypes.RETRIEVE_BRACKET_COUNT_RESPONSE:
        _store.playerCount = action.response;
        BracketStore.emit(CHANGE_EVENT);
        break;

    case Web3ActionTypes.RETRIEVE_BRACKET_WINNER_RESPONSE:
        _store.bracketWinner = action.response;
        BracketStore.emit(CHANGE_EVENT);
        break;

    case Web3ActionTypes.RETRIEVE_BRACKET_INFO_RESPONSE:
        _store.bracketWinner = action.response.winner;
        _store.bracketOwner = action.response.owner;
        _store.playerCount = action.response.playerCount;

        BracketStore.emit(CHANGE_EVENT);
        break;

    case Web3ActionTypes.GET_SEATS_SIDE_A_RESPONSE:
        _store.seats_SideA = action.response;

        BracketStore.emit(FETCH_SEATS_SIDE_A);
        break;

    case Web3ActionTypes.GET_SEATS_SIDE_B_RESPONSE:

        _store.seats_SideB = action.response;
        BracketStore.emit(FETCH_SEATS_SIDE_B);
        break;

    case Web3ActionTypes.TAKE_SEAT_SIDE_A_RESPONSE:
        console.log("TAKE_SEAT_SIDE_A_RESPONSE");

        console.log(action.response);

        switch(action.response)
        {
          case 'transactionHash':
            BracketStore.emit(EVENT_TXN_HASH);
            break;
          case 'confirmation':
            BracketStore.emit(EVENT_CONFIRMATION);
            break;
          case 'receipt':
            BracketStore.emit(EVENT_RECEIPT);
            break;
          case 'error':
            BracketStore.emit(EVENT_ERROR);
            break;
        }
        break;

    case Web3ActionTypes.TAKE_SEAT_SIDE_B_RESPONSE:
        console.log("TAKE_SEAT_SIDE_B_RESPONSE");

        console.log(action.response);

        switch(action.response)
        {
          case 'transactionHash':
            BracketStore.emit(EVENT_TXN_HASH);
            break;
          case 'confirmation':
            BracketStore.emit(EVENT_CONFIRMATION);
            break;
          case 'receipt':
            BracketStore.emit(EVENT_RECEIPT);
            break;
          case 'error':
            BracketStore.emit(EVENT_ERROR);
            break;
        }
        break;

    case Web3ActionTypes.PROMOTE_PLAYER_SIDE_A_RESPONSE:
        console.log("PROMOTE_PLAYER_SIDE_A_RESPONSE");

        console.log(action.response);

        switch(action.response)
        {
          case 'transactionHash':
            BracketStore.emit(EVENT_TXN_HASH);
            break;
          case 'confirmation':
            BracketStore.emit(EVENT_CONFIRMATION);
            break;
          case 'receipt':
            BracketStore.emit(EVENT_RECEIPT);
            break;
          case 'error':
            BracketStore.emit(EVENT_ERROR);
            break;
        }
        break;

    case Web3ActionTypes.PROMOTE_PLAYER_SIDE_B_RESPONSE:
        console.log("PROMOTE_PLAYER_SIDE_B_RESPONSE");

        console.log(action.response);

        switch(action.response)
        {
          case 'transactionHash':
            BracketStore.emit(EVENT_TXN_HASH);
            break;
          case 'confirmation':
            BracketStore.emit(EVENT_CONFIRMATION);
            break;
          case 'receipt':
            BracketStore.emit(EVENT_RECEIPT);
            break;
          case 'error':
            BracketStore.emit(EVENT_ERROR);
            break;
        }
        break;

    case Web3ActionTypes.SET_BRACKET_WINNER_RESPONSE:
      console.log("SET_BRACKET_WINNER_RESPONSE");

      console.log(action.response);
      switch(action.response)
      {
        case 'transactionHash':
          BracketStore.emit(EVENT_TXN_HASH);
          break;

        case 'confirmation':
          BracketStore.emit(EVENT_CONFIRMATION);
          break;

        case 'receipt':
          BracketStore.emit(EVENT_RECEIPT);
          break;

        case 'error':
          BracketStore.emit(EVENT_ERROR);
          break;

      }
      break;

    default:
      return true;
  }
});

module.exports = BracketStore;

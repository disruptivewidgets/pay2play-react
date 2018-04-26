var AppDispatcher = require('../dispatcher/AppDispatcher');
import Web3ActionTypes from '../constants/Web3ActionTypes';

module.exports = {
  retrieveWagers(response) {
    AppDispatcher.handleServerAction({
      actionType: Web3ActionTypes.RETRIEVE_WAGERS_RESPONSE,
      response: response
    });
  },
  receivedWager(response) {
    AppDispatcher.handleServerAction({
      actionType: Web3ActionTypes.RETRIEVE_WAGER_RESPONSE,
      response: response
    });
  },
  retrieveAccounts(response) {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_ACCOUNTS_RESPONSE,
      response: response
    });
  },
  startWager(response) {
    console.log("startWager");
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.START_WAGER_RESPONSE,
      response: response
    });
  },
  counterWagerAndDeposit(response) {
    console.log("counterWagerAndDeposit");
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.COUNTER_WAGER_AND_DEPOSIT_RESPONSE,
      response: response
    });
  },
  setWagerWinner(response) {
    console.log("setWagerWinner");
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.SET_WAGER_WINNER_RESPONSE,
      response: response
    });
  },
  withdrawWinnings(response) {
    console.log("withdrawWinnings");
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.WITHDRAW_WINNINGS_RESPONSE,
      response: response
    });
  },
  setSecret(response) {
    console.log("setSecret");
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.SET_SECRET_RESPONSE,
      response: response
    });
  },
  getSecretHash(response) {
    console.log("getSecretHash");
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.GET_SECRET_HASH_RESPONSE,
      response: response
    });
  },
  // Bracket
  getSeats_SideA(response) {
    AppDispatcher.handleServerAction({
      actionType: Web3ActionTypes.GET_SEATS_SIDE_A_RESPONSE,
      response: response
    });
  },
  getSeats_SideB(response) {
    AppDispatcher.handleServerAction({
      actionType: Web3ActionTypes.GET_SEATS_SIDE_B_RESPONSE,
      response: response
    });
  },
  takeSeat_SideA(response) {
    AppDispatcher.handleServerAction({
      actionType: Web3ActionTypes.TAKE_SEAT_SIDE_A_RESPONSE,
      response: response
    });
  },
  takeSeat_SideB(response) {
    AppDispatcher.handleServerAction({
      actionType: Web3ActionTypes.TAKE_SEAT_SIDE_B_RESPONSE,
      response: response
    });
  },
  // Misc
  ping(response) {
    console.log("ping");
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.PING,
      response: response
    });
  }
};

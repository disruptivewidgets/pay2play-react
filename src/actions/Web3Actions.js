import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';
import Web3API from '../api/Web3API';

const Actions = {
  retrieveWagers() {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_WAGERS,
    });

    Web3API.retrieveWagers();
  },
  retrieveWager(id) {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_WAGER,
    });

    Web3API.retrieveWager(id);
  },
  getAccounts() {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_ACCOUNTS,
    });

    Web3API.getAccounts();
  },
  startWager(hash, params) {
    console.log('startWager');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.START_WAGER,
    });

    Web3API.startWager(hash, params);
  },
  counterWagerAndDeposit(wagerId, params) {
    console.log('counterWagerAndDeposit');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.COUNTER_WAGER_AND_DEPOSIT,
    });

    Web3API.counterWagerAndDeposit(wagerId, params);
  },
  setWagerWinner(wagerId, winner, params) {
    console.log('setWagerWinner');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.SET_WAGER_WINNER,
    });

    Web3API.setWagerWinner(wagerId, winner, params);
  },
  withdrawWinnings(wagerId, params) {
    console.log('withdrawWinnings');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.WITHDRAW_WINNINGS,
    });

    Web3API.withdrawWinnings(wagerId, params);
  },
  setSecret(secret, params) {
    console.log('setSecret');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.SET_SECRET,
    });

    Web3API.setSecret(secret, params);
  },
  ping() {
    console.log('start wager');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.PING,
    });

    Web3API.ping();
  }
}

export default Actions;

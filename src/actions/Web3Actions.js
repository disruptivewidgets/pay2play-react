import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';
import Web3API from '../utils/Web3API';

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
  }
}

export default Actions;

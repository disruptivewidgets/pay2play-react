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
};

var AppDispatcher = require('../dispatcher/AppDispatcher');
import CacheActionTypes from '../constants/CacheActionTypes';

module.exports = {
  receivedTransactions(response) {
    AppDispatcher.handleServerAction({
      actionType: CacheActionTypes.GET_TRANSACTIONS_RESPONSE,
      response: response
    });
  },
};

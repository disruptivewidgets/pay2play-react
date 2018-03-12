var AppDispatcher = require('../dispatcher/AppDispatcher');
import CacheActionTypes from '../constants/CacheActionTypes';
import CacheAPI from '../api/CacheAPI';

module.exports = {
  retrieveTransactions() {
    AppDispatcher.handleViewAction({
      actionType: CacheActionTypes.GET_TRANSACTIONS,
    });

    CacheAPI.getTransactions();
  }
};

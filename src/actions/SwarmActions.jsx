var AppDispatcher = require('../dispatcher/AppDispatcher');
import SwarmActionTypes from '../constants/SwarmActionTypes';
import SwarmApi from '../utils/SwarmApi';

module.exports = {
  retrieveGames() {
    AppDispatcher.handleViewAction({
      actionType: SwarmActionTypes.RETRIEVE_GAMES,
    });

    SwarmApi.getGames();
  },
  retrieveRules(hash, wagerStartTimestamp) {
    SwarmApi.getGameRules(hash, wagerStartTimestamp);
  }
};

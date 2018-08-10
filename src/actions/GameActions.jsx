var AppDispatcher = require('../dispatcher/AppDispatcher');
import GameActionTypes from '../constants/GameActionTypes';
import GamesAPI from '../api/GamesAPI';

module.exports = {
  retrieveGames() {
    AppDispatcher.handleViewAction({
      actionType: GameActionTypes.RETRIEVE_GAMES,
    });

    GamesAPI.getGames();
  }
};

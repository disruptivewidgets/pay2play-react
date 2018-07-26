import AppDispatcher from '../dispatcher/AppDispatcher';
import DiscordBotActionTypes from '../constants/DiscordBotActionTypes';
import DiscordBotAPI from '../api/DiscordBotAPI';

const Actions = {
  retrievePlayers(gameId) {
    AppDispatcher.handleViewAction({
      actionType: DiscordBotActionTypes.RETRIEVE_PLAYERS,
    });

    DiscordBotAPI.retrievePlayers(gameId);
  },
  notify(type, address) {
    AppDispatcher.handleViewAction({
      actionType: DiscordBotActionTypes.NOTIFY_BUY_IN,
    });

    DiscordBotAPI.notify(type, address);
  }
}

export default Actions;

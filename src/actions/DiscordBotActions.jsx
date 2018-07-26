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
  notify(type, index, address) {

    if (type === 'buy-in') {
      AppDispatcher.handleViewAction({
        actionType: DiscordBotActionTypes.NOTIFY_BUY_IN,
      });
    }

    if (type === 'counter') {
      AppDispatcher.handleViewAction({
        actionType: DiscordBotActionTypes.NOTIFY_COUNTER,
      });
    }

    DiscordBotAPI.notify(type, index, address);
  }
}

export default Actions;

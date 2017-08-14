var AppDispatcher = require('../dispatcher/AppDispatcher');
import EventLogActionTypes from '../constants/EventLogActionTypes';
import EtherScanApi from '../utils/EtherScanApi';

module.exports = {
  pullEventLogs(key, index) {
    AppDispatcher.handleViewAction({
      actionType: EventLogActionTypes.RETRIEVE_GAMES,
    });

    EtherScanApi.pullEventLogs(key, index);
  }
};

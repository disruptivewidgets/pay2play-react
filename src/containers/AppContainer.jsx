import AppView from '../views/AppView';
import {Container} from 'flux/utils';

import DataStore from '../stores/DataStore';

function getStores() {
  return [
    DataStore,
  ];
}

function getState() {
  return {
    data: DataStore.getState(),
  };
}

export default Container.createFunctional(AppView, getStores, getState);

import Counter from './Counter';
import Immutable from 'immutable';
import AppDispatcher from '../dispatcher/AppDispatcher';
import {ReduceStore} from 'flux/utils';


class DataStore extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      default:
        return state;
    }
  }
}

export default new DataStore();

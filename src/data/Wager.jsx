import Immutable from 'immutable';

const Wager = Immutable.Record({
  id: '',
  index: '',
  state: '',
  date: '',
  startTimestamp: 0,
  amount: 0,
  referenceHash: ''
});

export default Wager;

import Immutable from 'immutable';

const Wager = Immutable.Record({
  id: '',
  index: '',
  state: '',
  date: '',
  startTimestamp: 0,
  amount: 0,
  referenceHash: '',
  winner: '',
  players: []
});

export default Wager;

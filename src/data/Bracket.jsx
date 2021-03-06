import Immutable from 'immutable';

const Bracket = Immutable.Record({
  id: '',
  index: 0,
  startTimestamp: 0,
  playerCount: 0,
  winner: '',
  owner: '',
  address: '',
  seats: []
});

export default Bracket;

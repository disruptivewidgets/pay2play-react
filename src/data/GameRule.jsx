import Immutable from 'immutable';

const Game = Immutable.Record({
  id: '',
  index: '',
  duration: 0,
  timeframe: '',
  title: '',
  referenceHash: ''
});

export default Game;

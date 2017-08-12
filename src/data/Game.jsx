import Immutable from 'immutable';

const Game = Immutable.Record({
  id: '',
  index: '',
  duration: 0,
  title: '',
  referenceHash: ''
});

export default Game;

let _counter = 1;

const GameCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default GameCounter;

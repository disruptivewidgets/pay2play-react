let _counter = 1;

const BracketCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default BracketCounter;

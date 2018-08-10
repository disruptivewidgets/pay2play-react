let _counter = 1;

const GameRuleCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default GameRuleCounter;

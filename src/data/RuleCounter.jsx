let _counter = 1;

const RuleCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default RuleCounter;

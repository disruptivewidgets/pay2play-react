let _counter = 1;

const WagerCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default WagerCounter;

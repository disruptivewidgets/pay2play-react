let _counter = 1;

const TransactionCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default TransactionCounter;

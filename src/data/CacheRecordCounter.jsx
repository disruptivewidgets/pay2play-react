let _counter = 1;

const CacheRecordCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default CacheRecordCounter;

let _counter = 1;

const EventLogCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default EventLogCounter;

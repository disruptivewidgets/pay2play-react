let _counter = 1;

const DiscordUserCounter = {
  increment() {
    return 'id-' + String(_counter++);
  },
};

export default DiscordUserCounter;

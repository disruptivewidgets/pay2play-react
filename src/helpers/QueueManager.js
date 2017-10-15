var QueueManager = {};

QueueManager.add = function add(method) {
  // sessionStorage.setItem(key, JSON.stringify(value));
  if (window.methodList === undefined) {
    window.methodList = [];
  }

  window.methodList.push(method);

  window.methodList.slice(-1)[0];
}

export default QueueManager;

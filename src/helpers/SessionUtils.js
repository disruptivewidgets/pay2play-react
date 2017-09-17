var Session = {};

Session.setJSON = function setState(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

Session.getJSON = function(key) {

  return JSON.parse(sessionStorage.getItem(key));
}

Session.storeTransaction = function (transaction) {
  var transactions = Session.getJSON("transactions");

  if (transactions) {
    transactions.push(transaction);
  } else {
    transactions = [];
    transactions.push(transaction);
  }

  Session.setJSON("transactions", transactions);
}

Session.updateTransaction = function (id, searchKey, replaceValue) {
  console.log("updateTransaction");

  var transactions = Session.getJSON("transactions");

  _.each(transactions, function(transaction) {
    _.each(transaction, function(value, key) {
      if(key === searchKey) {
        transaction[key] = replaceValue;
      }
    });
  });

  Session.setJSON("transactions", transactions);
}

Session.listTransactions = function () {
  console.log("listTransactions");

  var transactions = Session.getJSON("transactions");
  _.each(transactions, function(transaction) {
    console.log(transaction);
  });
}

Session.removeTransaction = function (key, value) {
  console.log("removeTransaction");

  var transactions = _.filter(Session.getJSON("transactions"), function(transaction) {
    return transaction[key] != value;
  });

  Session.setJSON("transactions", transactions);
}

Session.hasTransactionsWithStatus = function(status) {
  var transactions = _.filter(Session.getJSON("transactions"), function(transaction) {
    return transaction.status == status;
  });

  if (transactions.length > 0) {
    return transactions[0];
  } else {
    return null;
  }
}

Session.hasTransactionsWithWagerId = function(wagerId) {
  console.log(wagerId);

  var transactions = _.filter(Session.getJSON("transactions"), function(transaction) {
    return transaction.wagerId == wagerId;
  });

  if (transactions.length > 0) {
    return transactions[0];
  } else {
    return null;
  }
}

export default Session;

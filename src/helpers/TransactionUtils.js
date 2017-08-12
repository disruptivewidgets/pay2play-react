var Helpers = {};

Helpers.checkTxSuccess = function checkTxSuccess(txid, callback) {
  function whenMined(txid, cb) {
    function check() {
      window.web3.eth.getTransaction(txid, (err, tx) => {
        if (err) {
          return cb(err)
        }
        if (tx && tx.blockNumber) {
          cb(null, tx)
        } else {
          setTimeout(check, 500)
        }
      })
    }
    check();
  }

  whenMined(txid, (err, tx) => {
    if (err) {
      return callback(err)
    }
    window.web3.eth.getTransactionReceipt(txid, (err, receipt) => {
      if (receipt.gasUsed < tx.gas) {
        callback(null, receipt)
      } else {
        callback(null, false)
      }
    })
  })
}

Helpers.getTxHandler = function({onDone, onSuccess, onError}) {
  function reportError(err) {
    if (onError) {
      onError(err);
    } else {
      console.log(err.toString())
    }
    onDone();
  }

  return function(err, txid) {
    if (err) {
      return reportError(err);
    }
    console.log('Tx: ' + txid);
    
    Helpers.checkTxSuccess(txid, (err, receipt) => {
      if (err) {
        return reportError(err);
      }
      if (receipt) {
        onSuccess(txid, receipt);
        onDone();
      } else {
        reportError('The transaction failed')
      }

    })
  };
}

export default Helpers;

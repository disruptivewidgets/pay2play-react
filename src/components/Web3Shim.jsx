import React from 'react';
import Web3 from 'web3';

import interfaces from "../smart-contract/interfaces.js";
import ApiUtils from '../helpers/ApiUtils';

import { contractAddress } from '../utils/Web3Api.js';

import Web3Store from '../stores/Web3Store';

var Web3Shim = React.createClass({
  getInitialState: function() {
    return {
      version: '',
      authorizedAccount: 'None',
      blockNumber: 0
    };
  },
  componentWillMount() {
    console.log("componentWillMount Web3Shim");
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)

    //
    console.log("WEB3 START");

    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    console.log("Ropsen Pay2Play: ");
    console.log(contractAddress);

    // var subscription = window.web3.eth.subscribe('newBlockHeaders', function(error, result){
    //     if (!error)
    //         console.log(error);
    // })
    // .on("data", function(blockHeader){
    //   console.log(blockHeader);
    // });

    // // unsubscribes the subscription
    // subscription.unsubscribe(function(error, success){
    //     if(success)
    //         console.log('Successfully unsubscribed!');
    // });

    if (window.web3.eth.currentProvider.isConnected()) {
      console.log("web3 connected");
    } else {
      console.log("web3 not connected");
    }

    this.setState({version: window.web3.version});

    window.web3.eth.getAccounts((err, accounts) => {
      if (err || !accounts || accounts.length == 0) return;
      this.setState({authorizedAccount: accounts[0]});

      window.authorizedAccount = accounts[0];
    });

    window.web3.eth.getBlockNumber((err, blockNumber) => {
      this.setState({blockNumber: blockNumber});
    });

    window.contract = new window.web3.eth.Contract(interfaces.registrarInterface);
    contract.options.address = contractAddress; // Ropsen Pay2Play

    window.contract.methods.registrarStartDate().call({}, function(error, result) {
      console.log("registrarStartDate");
      console.log(error, result);
    });

    window.contract.methods.node().call({}, function(error, result) {
      console.log("node");
      console.log(error, result);

      window.hostNode = result;
    });

    console.log("WEB3 END");
    //
  },
  componentDidMount() {
    //
    console.log("WEB3SHIM MOUNTED");
    Web3Store.addChangeListener(this._onChange);
    //
  },
  componentWillUnmount: function() {
    //
    console.log("WEB3SHIM UNMOUNTED");
    Web3Store.removeChangeListener(this._onChange);
    //
  },
  _onChange: function() {
    console.log("Web3Shim _onChange fired");
  },
  render() {
    const isAuthorized = (window.authorizedAccount !== undefined);

    var style = "";
    if (isAuthorized)
    {
      style = "highlight-creator";
    }

    return (
      <div>
        <p className="highlighted">Web3 Status</p>
        <p>Library Version: { this.state.version }</p>
        <p>Block Number: { this.state.blockNumber }</p>

        <p>Authorized Account: <span className={style}>{ this.state.authorizedAccount }</span></p>
      </div>
    );
  }
});

module.exports = Web3Shim;

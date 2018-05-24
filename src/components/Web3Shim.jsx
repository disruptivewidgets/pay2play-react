import React, { Component } from 'react';
import Web3 from 'web3';

import interfaces from "../smart-contract/interfaces.js";
import ApiUtils from '../helpers/ApiUtils';

import util from 'ethereumjs-util';

import {
  contractAddress,
  tokenContractAddress,
  bracketRegistrarContractAddress

} from '../api/Web3API';

import Web3Store from '../stores/Web3Store';

import {
  Link,
  withRouter
} from 'react-router-dom'

export default class Web3Shim extends Component
{
  // getInitialState() {
  //   return {
  //     version: '',
  //     authorizedAccount: 'None',
  //     blockNumber: 0,
  //     tokenBalance: 0,
  //     winCount: 0,
  //     lossCount: 0
  //   };
  // }
  state =
  {
    version: '',
    authorizedAccount: 'None',
    blockNumber: 0,
    tokenBalance: 0,
    winCount: 0,
    lossCount: 0
  }
  componentWillMount() {
    console.log("componentWillMount Web3Shim");

    // if (typeof web3 !== 'undefined') {
    //   // Use Mist/MetaMask's provider
    //   window.web3 = new Web3(window.web3.currentProvider);
    //   // window.web3 = new Web3(web3.currentProvider);
    // } else {
    //   console.log('No web3? You should consider trying MetaMask!');
    //   // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //   window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    // }

    console.log("Ropsen Pay2Play: ");
    console.log("contractAddress: " + contractAddress);
    console.log("tokenContractAddress: " + tokenContractAddress);

    // if (window.web3.eth.currentProvider.isConnected()) {
    //   console.log("web3 connected");
    //
    //   // var subscription = window.web3.eth.subscribe('newBlockHeaders', function(error, result) {
    //   //   console.log(result);
    //   //
    //   //     if (!error)
    //   //         console.log(error);
    //   // })
    //   // .on("data", function(blockHeader) {
    //   //   console.log("HERE");
    //   // });
    //
    //   // var subscription = window.web3.eth.subscribe('syncing', function(error, sync){
    //   //     if (!error)
    //   //         console.log(sync);
    //   // })
    //   // .on("data", function(sync){
    //   //     // show some syncing stats
    //   //     console.log(sync);
    //   // })
    //   // .on("changed", function(isSyncing){
    //   //     if(isSyncing) {
    //   //         // stop app operation
    //   //         console.log("A");
    //   //     } else {
    //   //         // regain app operation
    //   //         console.log("B");
    //   //     }
    //   // });
    //
    //   // // unsubscribes the subscription
    //   // subscription.unsubscribe(function(error, success){
    //   //     if(success)
    //   //         console.log('Successfully unsubscribed!');
    //   // });
    //
    //   // Retrive wagers start
    //   var topic1 = util.bufferToHex(util.setLengthLeft(parseInt(1), 32));
    //
    //   window.web3.eth.getPastLogs({
    //     address: contractAddress,
    //     fromBlock: "0",
    //     topics: ["0x52b3086eb00fd2639eeb5190527da3e1c4c1400ee550073dde793315159cfe77"]
    //   }).then( value => {
    //     console.log(value); // Success!
    //   }, reason => {
    //     console.log(reason); // Error!
    //   } );
    //   // end
    //
    // } else {
    //   console.log("web3 not connected");
    // }

    this.setState({version: window.web3.version});

    window.web3.eth.getBlockNumber((err, blockNumber) => {
      this.setState({blockNumber: blockNumber});
    });

    window.contract = new window.web3.eth.Contract(interfaces.registrarInterface);
    window.contract.options.address = contractAddress; // Ropsen Pay2Play

    window.contract.methods.registrarStartDate().call({}, function(error, result) {
    });

    window.contract.methods.node().call({}, function(error, result) {
      window.host_WagerRegistrar = result;
    });

    window.tokenContract = new window.web3.eth.Contract(interfaces.tokenInterface);
    window.tokenContract.options.address = tokenContractAddress; // Ropsen Pay2Play

    window.bracketRegistrarContract = new window.web3.eth.Contract(interfaces.bracketRegistrarInterface);
    window.bracketRegistrarContract.options.address = bracketRegistrarContractAddress; // Ropsen Pay2Play

    console.log(bracketRegistrarContractAddress);

    window.bracketRegistrarContract.methods.node().call({}, function(error, result) {
      window.host_BracketRegistrar = result;
    });

    var shim = this;

    window.web3.eth.getAccounts((err, accounts) => {
      if (err || !accounts || accounts.length == 0) return;
      this.setState({authorizedAccount: accounts[0]});

      window.authorizedAccount = accounts[0];

      // window.tokenContract.options.address = tokenContractAddress; // Ropsen Pay2Play
      window.tokenContract.methods.balanceOf(window.authorizedAccount).call({}, function(error, result) {
        console.log("balanceOf");
        console.log(error, result);

        shim.setState({
          tokenBalance: result
        });
      });

      window.contract.methods.getWinCount(window.authorizedAccount).call({}, function(error, result) {
        console.log("getWinCount");
        console.log(error, result);

        shim.setState({
          winCount: result
        });
      });

      window.contract.methods.getLossCount(window.authorizedAccount).call({}, function(error, result) {
        console.log("getLossCount");
        console.log(error, result);

        shim.setState({
          lossCount: result
        });
      });

      window.contract.methods.secrets(window.authorizedAccount).call({}, function(error, result) {
        console.log("getSecret");
        console.log(error, result);

        // shim.setState({
        //   lossCount: result
        // });

        window.secretHash = result;
      });

    });
  }
  componentDidMount()
  {
    Web3Store.addChangeListener(this._onChange);
  }
  componentWillUnmount()
  {
    Web3Store.removeChangeListener(this._onChange);
  }
  _onChange() {
  }
  render() {
    const isAuthorized = (window.authorizedAccount !== undefined);

    var style = "";
    var url = "";
    if (isAuthorized)
    {
      style = "highlight-creator";
      // https://ropsten.etherscan.io/token/0x7e50651fc0229857ba21a4342124744283ba546d?a=0x360e9d72b8b74baf3fbc472963fa4879006cafc7
      url = "https://" + 'ropsten' + ".etherscan.io/token/" + tokenContractAddress + "?a=" + window.authorizedAccount;
    }

    return (
      <div>
        <p className="highlighted">Web3 Status</p>
        <p>Library Version: { this.state.version }</p>
        <p>Block Number: { this.state.blockNumber }</p>

        {
          isAuthorized ? (
            <div>
              <p>Authorized Account: <span className={style}>{ this.state.authorizedAccount }</span></p>
              <p>Token Balance: {this.state.tokenBalance} <a href={url}>Play</a></p>
              <p>Win Count: {this.state.winCount}</p>
              <p>Loss Count: {this.state.lossCount}</p>
              <p><Link to={`/secret`} replace>Set Secret</Link></p>
            </div>
          ) : (
            <div>
              <p>Authorized Account: <span className={style}>{ this.state.authorizedAccount }</span></p>
            </div>
          )
        }
      </div>
    );
  }
};

// module.exports = Web3Shim;

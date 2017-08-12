import React from 'react';
import Web3 from 'web3';

import interfaces from "../smart-contract/interfaces.js";
import ApiUtils from '../helpers/ApiUtils'

export default class Web3Shim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: '',
      authorizedAccount: 'None',
      blockNumber: 0
    };
  }
  componentWillMount() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
    } else {
      console.log('No web3? You should consider trying MetaMask!');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    return null;

    // API
    var url = "http://www.hypewizard.com/api/ask_amazon";
    var params = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'Business'
      })
    };

    var Api = {
      getItems: function() {
        return fetch(url, params)
          .then(ApiUtils.checkStatus)
          .then(ApiUtils.parseResponse)
          .then(function(response) {
            console.log(response);
            console.log(response["ItemAttributes"]["Title"]);
            return response;
          })
          .catch(e => e)
      },
    };

    Api.getItems();
    // API
  }
  componentDidMount() {
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

      // window.web3.eth.personal.unlockAccount(accounts[0]);
      //
      // window.web3.eth.personal.sign("test", accounts[0]).then(console.log);
      //
      // mist.requestAccount(function(e, address) {
      //   console.log(address);
      // });

    });

    window.web3.eth.getBlockNumber((err, blockNumber) => {
      this.setState({blockNumber: blockNumber});
    });

    window.contract = new window.web3.eth.Contract(interfaces.registrarInterface);
    contract.options.address = "0xdccd2a82cea71049b76c3824338f9af65f6515db"; // Ropsen Pay2Play

    window.contract.methods.registrarStartDate().call({}, function(error, result) {
      console.log(error, result);
    });

    console.log("connect contract END");
  }
  render() {
    return (
      <div>
        <p className="highlighted">Web3 Status</p>
        <p>Library Version: { this.state.version }</p>
        <p>Block Number: { this.state.blockNumber }</p>
        <p>Authorized Account: { this.state.authorizedAccount }</p>
      </div>
    );
  }
}

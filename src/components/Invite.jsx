import React from 'react';

import {
  Link,
  withRouter
} from 'react-router-dom'

import Rules from '../components/Rules';
import EventLogs from '../components/EventLogs';
import WagerStore from '../stores/WagerStore';
import Web3Store from '../stores/Web3Store';
import Web3Actions from '../actions/Web3Actions';
import SwarmActions from '../actions/SwarmActions';
import EventLogStore from '../stores/EventLogStore';
import Web3API from '../utils/Web3API';

import SessionHelper from "../helpers/SessionUtils.js";

import _ from 'lodash';

import Helpers from "../helpers/TransactionUtils.js";

import { Intent, Spinner } from "@blueprintjs/core";

import "@blueprintjs/core/dist/blueprint.css";

var Invite = React.createClass({
  getInitialState: function() {
    return WagerStore.get();
  },
  componentWillMount: function() {
    console.log("componentWillMount");

    this.setState(WagerStore.get());
    this.setState(Web3Store.getStore());

    this.setState({
      loaded: true,
      error: ''
    });

    Web3Actions.retrieveWager(this.props.match.params.id);
    Web3Actions.getAccounts();

    var transaction = SessionHelper.hasTransactionsWithWagerId(this.props.match.params.id.toString());

    if (transaction) {
      if(transaction.status == "pending_start_receipt_review") {
        SessionHelper.updateTransaction(transaction.id, "status", "finished_start_receipt_review");
      }

      if (transaction.status == "pending_counter_receipt_review") {
        this.setState({
          processing: true
        });
      }
    }

    SessionHelper.listTransactions();
  },
  componentDidMount: function() {
    // EventLogStore.getTransaction(this.props.match.params.id);

    WagerStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    WagerStore.removeChangeListener(this._onChange);
  },
  componentWillReceiveProps: function(nextProps) {
    console.log("componentWillReceiveProps");

    this.setState({
      loaded: true,
      error: ''
    });

    Web3Actions.retrieveWager(nextProps.match.params.id);
    Web3Actions.getAccounts();

    var transaction = SessionHelper.hasTransactionsWithWagerId(nextProps.match.params.id.toString());

    if (transaction) {
      if(transaction.status == "pending_start_receipt_review") {
        SessionHelper.updateTransaction(transaction.id, "status", "finished_start_receipt_review");
      }

      if (transaction.status == "pending_counter_receipt_review") {
        this.setState({
          processing: true
        });
      }
    }

    SessionHelper.listTransactions();
  },
  _onChange: function() {
    this.setState(WagerStore.get());
    this.setState(Web3Store.getStore());

    this.setState({
      players: this.state.wager.players
    });
  },
  render: function() {
    const referenceHash = this.state.wager.referenceHash;
    const startTimestamp = this.state.wager.startTimestamp;
    const isWagerOpen = (this.state.wager.state === 'open') ;
    const hasPlayers = (this.state.wager.players !== undefined);
    const isAuthorized = (window.authorizedAccount !== undefined);

    var isOwnerLoggedIn = false;

    var showCallToAction = false;

    if (hasPlayers) {
      isOwnerLoggedIn = (this.state.wager.players[0] === window.authorizedAccount);
    }

    if (isOwnerLoggedIn) {
      showCallToAction = true;
    }

    var error = this.state.error;
    var loaded = this.state.loaded;
    var processing = this.state.processing;

    const onSubmit = (event) => {

      event.preventDefault();

      this.setState({
        loaded: false,
        error: ''
      });

      if (window.authorizedAccount === undefined) {
        this.setState({
          loaded: true,
          error: 'Please connect an account with balance first.'
        });
        return;
      }

      const amount = window.web3.utils.toWei(0.01, 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei(20, 'shannon');

      var params = {
        value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      console.log(params);

      window.contract.methods.counterWagerAndDeposit(this.props.match.params.id).send(params, Helpers.getTxHandler({
          onStart: (txid) => {
            console.log("onStart");
            console.log("txid: " + txid);

            SessionHelper.removeTransaction("wagerId", this.props.match.params.id);

            var transaction = {
              id: txid,
              status: "pending_block",
              type: "counter",
              wagerId: this.props.match.params.id
            }

            SessionHelper.storeTransaction(transaction);
            SessionHelper.listTransactions();
          },
          onDone: () => {
            console.log("onDone");
          },
          onSuccess: (txid, receipt) => {
            console.log("onSuccess");
            console.log(txid);
            console.log(receipt);

            var logs = receipt.logs;

            var log = logs[0];

            var topics = log.topics;

            var topic = topics[1];

            var wagerId = window.web3.utils.hexToNumber(topic);

            SessionHelper.updateTransaction(txid, "status", "pending_counter_receipt_review");
            SessionHelper.listTransactions();

            // console.log(SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review"));

            this.setState({
              loaded: true,
              processing: true
            });
          },
          onError: (error) => {
            console.log("onError");

            this.setState({
              loaded: true
            });
          }
        })
      );
    };

    return (
      <div>
        { loaded ? (
          <div>
            <div className="highlighted">Wager Invite</div>
            <br />
            <div>Wager Id: <Link to={`/wagers/${this.state.wager.index}`} replace>{this.state.wager.index}</Link></div>
            <div>Start Time: {this.state.wager.date}</div>
            <div>Amount: {this.state.wager.amount}</div>

            <br />
            { referenceHash ? (
              <Rules referenceHash={referenceHash} startTimestamp={startTimestamp} />
            ) : (
              <Spinner intent={Intent.PRIMARY} />
            )}

            <br />
            { hasPlayers ? (
              <div>
                <div className="highlighted">Players</div>
                <br />

                {this.state.wager.players.map(address => (
                  <Player
                    key={address}
                    player={address}
                    winner={this.state.wager.winner}
                    accounts={this.state.accounts}
                  />
                ))}
              </div>
            ) : (
              <Spinner intent={Intent.PRIMARY} />
            )}

            { showCallToAction && isWagerOpen &&
              <div>
                <br />
                <div className="highlighted-green">Share this invite with your opponent or wait for someone to counter.</div>
              </div>
            }

            <br />
            { isWagerOpen && !isOwnerLoggedIn && isAuthorized &&
              <div>
                { processing ? (
                  <div>
                    <br />
                    <div className="highlighted-green">Congratulations! Your counter is in queue.</div>
                    <div>Note: This message will disappear when the queue clears.</div>
                    <br />
                  </div>
                ) : (
                  <form onSubmit={onSubmit}>
                    { error ? (
                      <div>
                        <div><input type="submit" value="Fund Wager" /></div>
                        <br />
                        <div className="error">{this.state.error}</div>
                      </div>
                    ) : (
                      <div><input type="submit" value="Fund Wager" /></div>
                    ) }
                    <br />
                  </form>
                )}
              </div>
            }

            <HomeButton to="/" label="Start Over" />
          </div>
        ) : (
          <div>
            <Spinner intent={Intent.PRIMARY} />
            <div>Please wait...</div>
            <br />
            <br />
          </div>
        ) }

        <br />
        <EventLogs index={this.props.match.params.id} />
      </div>
    );
  }
});

function Player(props) {

  const player = props.player;
  const winner = props.winner;
  const accounts = props.accounts;

  console.log(accounts);

  var element = <div>{player}</div>;

  if (accounts.length > 0) {
    if (accounts[0] == player) {
      element = <div>{player} (You)</div>
    }
  };

  return (
    <div>
      {element}
    </div>
  );
}

const HomeButton = withRouter(({ history, label, to }) => (
  <div>
    <button type="button" className="btn-secondary" onClick={() => history.push(to)} >
      {label}
    </button>
  </div>
));
module.exports = Invite;

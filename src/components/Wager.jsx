import React from 'react';
import WagerStore from '../stores/WagerStore';
import Web3Actions from '../actions/Web3Actions';
import Invite from '../components/Invite';
import Rules from '../components/Rules';
import EventLogs from '../components/EventLogs';

import WinnerSelector from '../components/WinnerSelector';

import Helpers from "../helpers/TransactionUtils.js";

import { Intent, Spinner } from "@blueprintjs/core";

import "@blueprintjs/core/dist/blueprint.css";

import {
  Link,
  withRouter
} from 'react-router-dom'

var Wager = React.createClass({
  getInitialState: function() {
    return WagerStore.get();
  },
  componentWillMount: function() {
    this.setState(WagerStore.get());

    Web3Actions.retrieveWager(this.props.match.params.id);
  },
  componentDidMount: function() {
    this.setState({
      loaded: true
    });

    WagerStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    WagerStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(WagerStore.get());
  },
  render: function() {
    const isWagerFinished = (this.state.wager.state === 'finished') ;
    const hasPlayers = (this.state.wager.players !== undefined);

    var isWinner = false;

    if (hasPlayers) {
      isWinner = (this.state.wager.winner === window.authorizedAccount);
    }

    var isLoser = false;

    if (hasPlayers) {
      if (!isWinner && this.state.wager.players.indexOf(window.authorizedAccount) != -1) {
        isLoser = true;
      }
    }

    if (!isWagerFinished) {
      isLoser = false;
      isWinner = false;
    }

    var loaded = this.state.loaded;

    const onSubmit = (event) => {
      event.preventDefault();

      console.log(event.target.name);

      const gas = 650000;
      // const gasPrice = window.web3.utils.toWei(20, 'shannon');

      switch(event.target.name) {
        case 'windraw-winnings-form':

          this.setState({
            loaded: false
          });

          var params = {
            from: window.authorizedAccount,
            gas: gas
          };

          console.log(params);

          window.contract.methods.withdrawWinnings(this.props.match.params.id).send(params, Helpers.getTxHandler({
              onDone: () => {
                console.log("onDone");
              },
              onSuccess: (txid, receipt) => {
                console.log("onSuccess");
                console.log(txid, receipt);

                this.setState({
                  loaded: true
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
          break;
        case 'set-winner-form':
          console.log(event.target.winner.value);

          this.setState({
            loaded: false
          });

          const winner = event.target.winner.value;
          const amount = window.web3.utils.toWei(0.01, 'ether');

          var params = {
            from: window.authorizedAccount,
            gas: gas
          };

          console.log(params);

          window.contract.methods.setWagerWinner(this.props.match.params.id, winner).send(params, Helpers.getTxHandler({
              onDone: () => {
                console.log("onDone");
              },
              onSuccess: (txid, receipt) => {
                console.log("onSuccess");
                console.log(txid, receipt);

                this.setState({
                  loaded: true
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
          break;
      }
    };

    const referenceHash = this.state.wager.referenceHash;
    const startTimestamp = this.state.wager.startTimestamp;

    var loaded = this.state.loaded;

    var isModerator = false;
    if (window.authorizedAccount == window.hostNode) {
      isModerator = true;
    }

    return (
        <div>
          <div className="highlighted">Wager Ticket</div>
          <br />
          <div>Wager Id: {this.state.wager.index}</div>
          <div>Start Time: {this.state.wager.date}</div>
          <div>{this.state.wager.state}</div>
          <div>Amount: {this.state.wager.amount}</div>

          <br />
          { referenceHash ? (
            <Rules referenceHash={referenceHash} startTimestamp={startTimestamp} />
          ) : (
            <Spinner intent={Intent.PRIMARY} />
          )}

          { isModerator ? (
            <div>
              <br />
              <div className="highlighted-green">Moderator Tools</div>

              { loaded ? (
                <div>
                  { isWagerFinished ? (
                      <div>
                        <br />
                        <div>Wager Winner: {this.state.wager.winner}</div>
                      </div>
                    ) : (
                      <div>
                        <br />
                        <form name="set-winner-form" onSubmit={onSubmit}>
                          <WinnerSelector onSelect={this.handleSelect} players={this.state.wager.players} />
                          <div><input type="submit" value="Set Winner" /></div>
                        </form>
                      </div>
                  )}
                </div>
              ) : (
                <div>
                  <br />
                  <div>
                    <Spinner intent={Intent.PRIMARY} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <br />
              { isWinner &&
                <div>
                  { loaded ? (
                    <form>
                      <div className="highlighted-green">Congratulations! You are the winner!</div>
                      <br />

                      <form name="windraw-winnings-form" onSubmit={onSubmit}>
                        <div><input type="submit" value="Withdraw Winnings" /></div>
                      </form>

                      <br />
                    </form>
                  ) : (
                    <div>
                      <br />
                      <div>
                        <Spinner intent={Intent.PRIMARY} />
                      </div>
                      <br />
                    </div>
                  )}
                </div>
              }
              { isLoser &&
                <div>
                  <div className="highlighted-red">Sorry, you lost. Better luck next time!</div>
                  <br />
                </div>
              }
              <HomeButton to="/" label="Start Over" />
            </div>
          )}

          <br />
          <div className="highlighted">Related</div>

          <br />
          <div>Invite Id: <Link to={`/invites/${this.state.wager.index}`} replace>{this.state.wager.index}</Link></div>

          <br />
          <EventLogs index={this.props.match.params.id} />
        </div>
    );
  }
});

const HomeButton = withRouter(({ history, label, to }) => (
  <div>
    <button type="button" className="btn-secondary" onClick={() => history.push(to)} >
      {label}
    </button>
  </div>
));
module.exports = Wager;

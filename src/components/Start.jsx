import React, { Component } from 'react';

import DiscordUserSelector from '../components/DiscordUserSelector';
import GameSelector from '../components/GameSelector';

import DiscordBotActions from '../actions/DiscordBotActions';
import GameActions from '../actions/GameActions';
import Web3Actions from '../actions/Web3Actions';

import DiscordBotAPI from '../api/DiscordBotAPI';
import RulesAPI from '../api/RulesAPI.js';

import GameStore from '../stores/GameStore';
import DiscordBotStore from '../stores/DiscordBotStore';
import Web3Store from '../stores/Web3Store';
import WagerStore from '../stores/WagerStore';

import TransactionHelper from "../helpers/TransactionUtils.js";
import SessionHelper from "../helpers/SessionUtils.js";
import QueueManager from "../helpers/QueueManager.js";

import { Intent, Spinner } from "@blueprintjs/core/dist";

import "@blueprintjs/core/dist/blueprint.css";

var validator = require('validator');

import axios from 'axios';

import {
  Link,
  withRouter
} from 'react-router-dom'

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import _ from 'lodash';

var loading_captions = [
  "Loading Game Rules...",
  "Pending Payment...",
  "Pending Confirmation..."
];

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);

    this._onChange = this._onChange.bind(this);

    this.onEvent_TransactionHash = this.onEvent_TransactionHash.bind(this);
    this.onEvent_Confirmation = this.onEvent_Confirmation.bind(this);
    this.onEvent_Receipt = this.onEvent_Receipt.bind(this);
    this.onEvent_Error = this.onEvent_Error.bind(this);

    this.onEvent_RetrievePlayers = this.onEvent_RetrievePlayers.bind(this);
  }
  componentWillMount() {
    if (SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review"))
    {
      this.setState({
        processing: true
      });
    }

    this.setState({
      games: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      selected_Game: { value: 'one', label: 'One' },
      selected_DiscordUserOption: { value: 'one', label: 'One' },
      options_DiscordUsers: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      loaded: false,
      error: '',
      amount: '',
      loading_caption: loading_captions[0],
      hasEntryTicket: false
    });

    let gameStore = GameStore.getDataStore();
    let discordBotStore = DiscordBotStore.getStore();

    this.setState(gameStore);

    DiscordBotActions.retrievePlayers(0);
    GameActions.retrieveGames();
  }
  componentDidMount() {
    console.log("componentDidMount");

    GameStore.addChangeListener(this._onChange);

    DiscordBotStore.addRetrievePlayersListener(this.onEvent_RetrievePlayers);

    Web3Store.addTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.addConfirmationListener(this.onEvent_Confirmation);
    Web3Store.addReceiptListener(this.onEvent_Receipt);
    Web3Store.addErrorListener(this.onEvent_Error);
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");

    GameStore.removeChangeListener(this._onChange);

    DiscordBotStore.removeRetrievePlayersListener(this.onEvent_RetrievePlayers);

    Web3Store.removeTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.removeConfirmationListener(this.onEvent_Confirmation);
    Web3Store.removeReceiptListener(this.onEvent_Receipt);
    Web3Store.removeErrorListener(this.onEvent_Error);
  }
  _onChange() {
    var dataStore = GameStore.getDataStore();

    var games = _.map(dataStore.list, function(item) {
      var game = {
        value: item.referenceHash,
        label: item.title
      };
      return game;
    });

    var selected = _.find(dataStore.list, function(game) {
      console.log(game.referenceHash, games[0].value);
      return game.referenceHash == games[0].value;
    });

    this.setState({
      games: games,
      value: games[0],
      referenceHash: selected.referenceHash,
      loaded: true,
      selected_Game: games[0]
    });

    this.setState(GameStore.getDataStore());
  }
  onEvent_TransactionHash() {
    console.log("onEvent_TransactionHash");

    this.setState({
        loading_caption: loading_captions[2]
    });
  }
  onEvent_Confirmation() {
    console.log("onEvent_Confirmation");

    let {
      selected_DiscordUserOption
    } = this.state;

    DiscordBotActions.notify(
      'buy-in',
      selected_DiscordUserOption.value
    );

    this.setState({
      loaded: true,
      processing: true
    });
  }
  onEvent_Receipt() {
    console.log("onEvent_Receipt");
  }
  onEvent_Error() {
    console.log("onEvent_Error");

    this.setState({
      loaded: true
    });

    this.forceUpdate();
  }
  onEvent_RetrievePlayers() {
    let discordUsers = DiscordBotStore.getStore();
    discordUsers = discordUsers.users;

    let options = _.map(discordUsers, (discordUser) => {
      var option = {
        value: discordUser.ethereumAddress,
        label: `${discordUser.discordUsername}#${discordUser.discordDiscriminator}`
      };

      return option;
    });

    let selected = _.find(discordUsers, (discordUser) => {
      return discordUser.ethereumAddress == options[0].value;
    });

    let option = options[0];

    // EntryTicket
    if (window.authorizedAccount === undefined) {

    } else {
      console.log(discordUsers);

      let discordUser = _.find(
        discordUsers, {
          'ethereumAddress': window.authorizedAccount
        }
      );

      console.log(discordUser);

      if (discordUser) {
        console.log("entry ticket found");

        let discordUserIndex = _.findIndex(
          discordUsers, {
            'ethereumAddress': window.authorizedAccount
          }
        );

        console.log(discordUserIndex);

        option = options[discordUserIndex];

        this.setState({
          hasEntryTicket: true
        });
      } else {
        console.log("entry ticket not found.");

        this.setState({
          hasEntryTicket: false
        });
      }
    }

    this.setState({
      discordUsers,
      options_DiscordUsers: options,
      selected_DiscordUserOption: option
    });
  }
  forceUpdate() {
    this.setState(GameStore.getDataStore());
  }
  handleSelect(selector, value) {
    console.log("handleSelect");
    if (selector === 'game-selector') {
      this.setState({
        referenceHash: value.value,
        selected_Game: value
      });
    }

    if (selector === 'discord-user-selector') {
      console.log(value);

      this.setState({
        selected_DiscordUserOption: value
      });
    }
  }
  render() {
    let {
      error,
      loaded,
      processing,

      discordUsers,
      options_DiscordUsers,
      selected_DiscordUserOption,

      selected_Game,

      hasEntryTicket
    } = this.state;

    const onChange = (event) => {
      this.setState({
        amount: event.target.value,
        error: ''
      });
    };

    var transaction = SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review");

    console.log(transaction);

    var queuedWagerId = -1;
    if (transaction) {
      queuedWagerId = transaction.wagerId;
    }

    const onSubmit = (event) => {

      let {
        amount,
        referenceHash,
        selected_DiscordUserOption
      } = this.state;

      event.preventDefault();

      // console.log(this.state.amount);
      // console.log(this.state.referenceHash);

      this.setState({
        loaded: false,
        error: '',
        loading_caption: loading_captions[1]
      });

      // var amount = this.state.amount;

      if (!validator.isDecimal(amount)) {
        console.log("Incorrect amount");

        this.setState({
          loaded: true,
          error: 'Please enter correct amount.'
        });

        return;
      }

      amount = Number(amount);

      if (amount < 0.01) {
        console.log("Minimum bet is 0.01");

        this.setState({
          loaded: true,
          error: 'Please bet more than or equal to 0.01.'
        });

        return;
      }

      if (window.authorizedAccount === undefined) {
        this.setState({
          loaded: true,
          error: 'Please connect an account with balance first.'
        });
        return;
      }

      amount = window.web3.utils.toWei(amount.toString(), 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei("20", 'shannon');

      var params = {
        value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      if (selected_DiscordUserOption) {
        console.log(selected_DiscordUserOption.value);
        // Web3Actions.startWager(referenceHash, params);
      } else {
        Web3Actions.startWager(referenceHash, params);
      }
    };

    return (
      <div>
        <div className="highlighted">Wager Details</div>
        <br />
        { loaded ? (
          <div>
            { processing ? (
              <div>
                <div className="highlighted-green">Congratulations! Your wager is in queue.</div>
                <div>Note: You will be able to start more wagers once the queue clears.</div>
                <br />
                <div>Invite Id: <Link to={`/invites/${queuedWagerId}`} replace>{queuedWagerId}</Link></div>
                <br />
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div>Who are you wagering for?</div>
                <DiscordUserSelector
                  onSelect={this.handleSelect}
                  data={discordUsers}
                  options={options_DiscordUsers}
                  selected={selected_DiscordUserOption}
                />

                {
                  !hasEntryTicket &&
                  <div>Looks like you don't have an entry ticket. In order to wager for yourself, you need to get one. Please head to our discord and talk to <b>butler bot</b> to obtain one.</div>
                }

                <br />

                <div>What's the game?</div>
                <GameSelector
                  onSelect={this.handleSelect}
                  data={this.state.list}
                  options={this.state.games}
                  selected={selected_Game}
                />

                <div>How much are you stacking?</div>
                <label>
                  <BrowserView device={isBrowser}>
                    <input type="text" placeholder="Enter Amount" value={this.state.amount} onChange={onChange} />
                  </BrowserView>

                  <MobileView device={isMobile}>
                    <input type="text" className="mobile" placeholder="Enter Amount" value={this.state.amount} onChange={onChange} />
                  </MobileView>
                </label>
                <br />

                { error ? (
                  <div>
                    <div><input type="submit" value="Start Wager" /></div>
                    <br />
                    <div className="error">{this.state.error}</div>
                  </div>
                ) : (
                  <div><input type="submit" value="Start Wager" /></div>
                ) }

                <br />
              </form>
            ) }
          </div>
        ) : (
          <div>
            <Spinner intent={Intent.PRIMARY} />
            <div>{this.state.loading_caption}</div>
            <br />
          </div>
        ) }
      </div>
    );
  }
};

// module.exports = Start;

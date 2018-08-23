import React, { Component } from 'react';

import DiscordUserSelector from '../components/DiscordUserSelector';
import GameSelector from '../components/GameSelector';

import DiscordBotActions from '../actions/DiscordBotActions';

import GameActions from '../actions/GameActions';
import GameRulesActions from '../actions/GameRulesActions';

import Web3Actions from '../actions/Web3Actions';

import DiscordBotAPI from '../api/DiscordBotAPI';
import RulesAPI from '../api/RulesAPI.js';

import GameStore from '../stores/GameStore';
import GameRulesStore from '../stores/GameRulesStore';

import DiscordBotStore from '../stores/DiscordBotStore';
import Web3Store from '../stores/Web3Store';
import WagerStore from '../stores/WagerStore';

import TransactionHelper from "../helpers/TransactionUtils.js";
import SessionHelper from "../helpers/SessionUtils.js";
import QueueManager from "../helpers/QueueManager.js";

import { fetchGame } from '../components/Rules';

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
  "Please wait... Pending payment...",
  "Please wait... Pending confirmation..."
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

    this.onEvent_GameStoreChange = this.onEvent_GameStoreChange.bind(this);
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
    this.setState(gameStore);

    GameActions.retrieveGames();

    let gameRulesStore = GameRulesStore.getDataStore();
    this.setState(gameRulesStore);

    GameRulesActions.retrieveGames();

    let discordBotStore = DiscordBotStore.getStore();

    DiscordBotActions.retrievePlayers(0);
  }
  componentDidMount() {
    GameStore.addChangeListener(this.onEvent_GameStoreChange);

    GameRulesStore.addChangeListener(this._onChange);

    DiscordBotStore.addRetrievePlayersListener(this.onEvent_RetrievePlayers);

    Web3Store.addTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.addConfirmationListener(this.onEvent_Confirmation);
    Web3Store.addReceiptListener(this.onEvent_Receipt);
    Web3Store.addErrorListener(this.onEvent_Error);
  }
  componentWillUnmount() {
    GameStore.removeChangeListener(this.onEvent_GameStoreChange);

    GameRulesStore.removeChangeListener(this._onChange);

    DiscordBotStore.removeRetrievePlayersListener(this.onEvent_RetrievePlayers);

    Web3Store.removeTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.removeConfirmationListener(this.onEvent_Confirmation);
    Web3Store.removeReceiptListener(this.onEvent_Receipt);
    Web3Store.removeErrorListener(this.onEvent_Error);
  }
  _onChange() {
    var dataStore = GameRulesStore.getDataStore();

    var games = _.map(dataStore.list, function(item) {

      var game = {
        value: item.referenceHash,
        label: item.title
      };
      return game;
    });

    var selected = _.find(dataStore.list, function(game) {
      return game.referenceHash == games[0].value;
    });

    // this.setState({
    //   games: games,
    //   value: games[0],
    //   referenceHash: selected.referenceHash,
    //   loaded: true,
    //   selected_Game: games[0]
    // });

    this.setState(GameRulesStore.getDataStore());
  }
  onEvent_GameStoreChange() {
    var dataStore = GameStore.getDataStore();

    var games = _.map(dataStore.list, function(item) {
      var game = {
        value: item.referenceHash,
        label: item.title
      };
      return game;
    });

    var selected = _.find(dataStore.list, function(game) {
      return game.referenceHash == games[0].value;
    });

    this.setState({
      games: games,
      value: games[0],
      loaded: true,
      referenceHash: selected.referenceHash,
      selected_Game: games[0]
    });

    this.setState(GameRulesStore.getDataStore());

  }
  onEvent_TransactionHash() {
    this.setState({
        loading_caption: loading_captions[2]
    });
  }
  onEvent_Confirmation() {
    let {
      selected_DiscordUserOption
    } = this.state;

    // DiscordBotActions.notify(
    //   'buy-in',
    //   selected_DiscordUserOption.value
    // );

    this.setState({
      loaded: true,
      processing: true
    });
  }
  onEvent_Receipt() {
  }
  onEvent_Error() {
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

    // let selected = _.find(discordUsers, (discordUser) => {
    //   return discordUser.ethereumAddress == options[0].value;
    // });

    let option = options[0];

    // EntryTicket
    if (window.authorizedAccount === undefined) {

    } else {
      let discordUser = _.find(
        discordUsers, {
          'ethereumAddress': window.authorizedAccount
        }
      );

      if (discordUser) {
        let discordUserIndex = _.findIndex(
          discordUsers, {
            'ethereumAddress': window.authorizedAccount
          }
        );

        option = options[discordUserIndex];
        option.label += ' (You)';

        this.setState({
          hasEntryTicket: true
        });
      } else {
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

    this.forceUpdate();
  }
  forceUpdate() {
    this.setState(GameStore.getDataStore());
  }
  handleSelect(selector, value) {
    if (selector === 'game-selector') {
      this.setState({
        referenceHash: value.value,
        selected_Game: value
      });

      let id = fetchGame(value.value).id;
      DiscordBotActions.retrievePlayers(id);
    }

    if (selector === 'discord-user-selector') {
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

    let hasDiscordUsers = false;

    if (typeof discordUsers !== 'undefined' && discordUsers.length > 0) {
      hasDiscordUsers = true;
    }

    const onChange = (event) => {
      this.setState({
        amount: event.target.value,
        error: ''
      });
    };

    var transaction = SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review");

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

      this.setState({
        loaded: false,
        error: '',
        loading_caption: loading_captions[1]
      });

      // var amount = this.state.amount;

      if (!validator.isDecimal(amount)) {
        this.setState({
          loaded: true,
          error: 'Please enter correct amount.'
        });

        return;
      }

      amount = Number(amount);

      if (amount < 0.01) {
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
        Web3Actions.startWager(referenceHash, selected_DiscordUserOption.value, params);
      } else {
        Web3Actions.startWager(referenceHash, selected_DiscordUserOption.value, params);
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
                <div>What's the game?</div>
                <GameSelector
                  onSelect={this.handleSelect}
                  data={this.state.list}
                  options={this.state.games}
                  selected={selected_Game}
                />

                {
                  hasDiscordUsers ? (
                    <div>
                      <div>Who are you wagering for?</div>
                      <DiscordUserSelector
                        onSelect={this.handleSelect}
                        data={discordUsers}
                        options={options_DiscordUsers}
                        selected={selected_DiscordUserOption}
                      />

                      {
                        !hasEntryTicket &&
                        <div>
                            <br />
                            <div className="highlighted-raspberry">Looks like you don't have an entry ticket for this game. <br /> If you want to wager for your self head talk to <b>butler</b> in our <a href="https://discord.gg/XW6gtmA">discord</a> to obtain one.</div>
                        </div>
                      }

                      <br />

                      <div>How much?</div>
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
                    </div>
                  ) : (
                    <div>
                      <div>
                        Currently, there are no players wagering in this game.
                      </div>
                      <br />
                    </div>
                  )
                }
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

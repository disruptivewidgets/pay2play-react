import React, {Component} from 'react';

import GameStore from '../stores/GameStore';
import SwarmActions from '../actions/SwarmActions';

import { Intent, Spinner, DatePickerFactory } from "@blueprintjs/core";

import "@blueprintjs/core/dist/blueprint.css";

import _ from 'lodash';

import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

var GameSelector = React.createClass({
  getInitialState: function() {
    return GameStore.getDataStore();
  },
  componentWillMount: function() {
    this.setState(GameStore.getDataStore());

    SwarmActions.retrieveGames();
  },
  componentDidMount: function() {
    this.setState({
      games: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      value: "one",
      loaded: false
    });
    GameStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    GameStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    var dataStore = GameStore.getDataStore();

    var games = _.map(dataStore.list, function(item) {
      var game = {
        value: item.referenceHash,
        label: item.title
      };
      return game;
    });

    console.log("HERE");

    var selected = _.find(dataStore.list, function(game) {
      console.log(game.referenceHash, games[0].value);
      return game.referenceHash == games[0].value;
    });

    console.log(selected);

    this.setState({
        games: games,
        value: games[0],
        loaded: true,
        selected: selected
    });

    this.props.onSelect(games[0]);

    this.setState(GameStore.getDataStore());
  },
  render: function() {
    const onChange = (value) => {
      console.log("Selected: " + JSON.stringify(value));

      var selected = _.find(this.state.list, function(game) {
        return game.referenceHash == value.value;
      });

      this.setState({
          selected: selected,
          value: value
      });

      this.props.onSelect(value);
    };

    const loaded = this.state.loaded;

    return (
      <div>
        { loaded ? (
          <div>
            <p className="highlighted">Select your wager</p>

            <Select
              addLabelText='Select One'
              name="form-field-name"
              options={this.state.games}
              onChange={onChange}
              value={this.state.value}
              clearable={false}
              cache={false}
              searchable={false}
            />

            <br />
            <GameItem
              key={this.state.selected.id}
              item={this.state.selected}
            />
            <br />
          </div>
        ) : (
          <div>
            <Spinner intent={Intent.PRIMARY} />
            <br />
            <br />
          </div>
        ) }
      </div>
    );
  }
});

function GameItem(props) {
  const {item} = props;
  return (
    <div>
      <label>
        Swarm Hash: {item.referenceHash}
      </label>
      <br />
      <label>
        Effective Timeframe: {item.timeframe}
      </label>
    </div>
  );
}

module.exports = GameSelector;

import React, { Component } from 'react';

import { Intent, Spinner } from "@blueprintjs/core/dist";

import "@blueprintjs/core/dist/blueprint.css";

import _ from 'lodash';

import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

export default class WinnerSelector extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ]
    };
    this._onChange = this._onChange.bind(this);
  }
  componentWillMount() {
    // this.setState(GameStore.getDataStore());

    // GameActions.retrieveGames();
  }
  componentWillReceiveProps() {
    var options = _.map(this.props.players, function(player) {
      var option = {
        value: player,
        label: player
      };
      return option;
    });

    this.setState({
      options: options
    });
  }
  componentDidMount() {
    console.log("players: " + this.props.players);

    var options = _.map(this.props.players, function(player) {
      var option = {
        value: player,
        label: player
      };
      return option;
    });

    this.setState({
      options: options
    });
    // GameStore.addChangeListener(this._onChange);
  }
  componentWillUnmount() {
    // GameStore.removeChangeListener(this._onChange);
  }
  _onChange() {
    // var dataStore = GameStore.getDataStore();
    //
    // var games = _.map(dataStore.list, function(item) {
    //   var game = {
    //     value: item.referenceHash,
    //     label: item.title
    //   };
    //   return game;
    // });
    //
    // console.log("HERE");
    //
    // var selected = _.find(dataStore.list, function(game) {
    //   console.log(game.referenceHash, games[0].value);
    //   return game.referenceHash == games[0].value;
    // });
    //
    // console.log(selected);
    //
    // this.setState({
    //     games: games,
    //     value: games[0],
    //     loaded: true,
    //     selected: selected
    // });
    //
    // this.props.onSelect(games[0]);å
    //
    // this.setState(GameStore.getDataStore());
  }
  render() {
    const onChange = (value) => {
      console.log("Selected: " + JSON.stringify(value));

      var selected = _.find(this.state.options, function(option) {
        return option.value == value.value;
      });

      this.setState({
          selected: selected,
          value: value
      });

      // this.props.onSelect(value);
    };

    // const loaded = this.state.loaded;
    var loaded = true;

    return (
      <div>
        { loaded ? (
          <div>
            <Select
              addLabelText='Select Winner'
              name="winner"
              options={this.state.options}
              onChange={onChange}
              value={this.state.value}
              clearable={false}
              cache={false}
              searchable={false}
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
};

// module.exports = WinnerSelector;

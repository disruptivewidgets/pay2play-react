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
  componentWillMount: function() {
    console.log("componentWillMount");

    this.setState({
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      selected: { value: 'one', label: 'One' }
    });
  },
  componentDidMount: function() {
  },
  componentWillUnmount: function() {
  },
  componentWillReceiveProps: function(nextProps) {
    console.log("componentWillReceiveProps");

    var selected = _.find(nextProps.data, function(game) {
      return game.referenceHash == nextProps.selected.value;
    });

    this.setState({
        selected: selected,
        value: nextProps.selected,
        options: this.props.options
    });

    // this.props.onSelect(nextProps.selected);
  },
  _onChange: function() {
  },
  render: function() {
    const onChange = (value) => {
      this.props.onSelect(value);
    };

    return (
      <div>
        <Select
          addLabelText='Select Game'
          name="form-field-name"
          options={this.state.options}
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

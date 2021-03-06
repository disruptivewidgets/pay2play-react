import React, { Component } from 'react';

import GameStore from '../stores/GameStore';
import GameActions from '../actions/GameActions';

import { Intent, Spinner, DatePickerFactory } from "@blueprintjs/core/dist";

import "@blueprintjs/core/dist/blueprint.css";

import _ from 'lodash';

import Select from 'react-select';

import 'react-select/dist/react-select.css';

export default class GameSelector extends Component {
  componentWillMount() {
    this.setState({
      options: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      selected: { value: 'one', label: 'One' }
    });
  }
  componentWillReceiveProps(nextProps) {
    var selected = _.find(nextProps.data, function(game) {
      return game.referenceHash == nextProps.selected.value;
    });

    this.setState({
      selected: selected,
      value: nextProps.selected,
      options: this.props.options
    });

    // this.props.onSelect(nextProps.selected);
  }
  render() {
    let { onSelect } = this.props;

    const onChange = (value) => {
      onSelect('game-selector', value);

      console.log('pull players');
    };

    return (
      <div>
        <Select
          addLabelText='Select Game'
          options={this.state.options}
          onChange={onChange}
          value={this.state.value}
          clearable={false}
          cache={false}
          searchable={false}
        />

        <br />
      </div>
    );
  }
};

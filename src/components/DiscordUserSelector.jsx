import React, {Component} from 'react';

import "@blueprintjs/core/dist/blueprint.css";

import _ from 'lodash';

import Select from 'react-select';

import 'react-select/dist/react-select.css';

export default class DiscordUserSelector extends Component {
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
    let { options } = this.props;

    let selected = _.find(nextProps.data, (user) => {
      return user.ethereumAddress == nextProps.selected.value;
    });

    this.setState({
      selected: selected,
      value: nextProps.selected,
      options: options
    });
  }
  render() {
    let { options, value } = this.state;
    let { onSelect } = this.props;

    const onChange = (value) => {
      onSelect('discord-user-selector', value);
    };

    return (
      <div>
        <Select
          addLabelText='Select Player'
          options={options}
          onChange={onChange}
          value={value}
          clearable={false}
          cache={false}
          searchable={false}
        />

        <br />
        {/* <GameItem
          key={this.state.selected.id}
          item={this.state.selected}
        /> */}
        <br />
      </div>
    );
  }
};

function GameItem(props) {
  const { item } = props;

  let referenceHash = item.referenceHash;

  if (referenceHash) {
    var head = referenceHash.substring(0, 5);
    var tail = referenceHash.substring(referenceHash.length - 5, referenceHash.length);
    referenceHash = head + '...' + tail;
  }

  return (
    <div>
      <label>
        Rules Hash: {referenceHash}
      </label>
      <br />
      <label>
        Effective Timeframe: {item.timeframe}
      </label>
    </div>
  );
}

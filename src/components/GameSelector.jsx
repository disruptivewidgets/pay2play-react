import React from 'react';
import GameStore from '../stores/GameStore';
import SwarmActions from '../actions/SwarmActions';


var GameSelector = React.createClass({
  getInitialState: function() {
    return GameStore.getDataStore();
  },
  componentWillMount: function() {
    this.setState(GameStore.getDataStore());

    SwarmActions.retrieveGames();
  },
  componentDidMount: function() {
    GameStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    GameStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(GameStore.getDataStore());
  },
  render: function() {
    return (
      <div>
        <div className="highlighted">Select game</div>
        {this.state.list.map(item => (
          <GameItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    );
  }
});

function GameItem(props) {
  const {item} = props;
  return (
    <div>
      <label>
        {item.index }| {item.referenceHash} | {item.duration} | {item.title}
      </label>
    </div>
  );
}

module.exports = GameSelector;

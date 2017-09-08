import React from 'react';
import EventLogStore from '../stores/EventLogStore';
import EventLogActions from '../actions/EventLogActions';

var EventLogs = React.createClass({
  getInitialState: function() {
    return EventLogStore.getDataStore();
  },
  componentWillMount: function() {

    console.log(this.props);
    this.setState(EventLogStore.getDataStore());

    EventLogActions.pullEventLogs("WagerStarted", this.props.index);
  },
  componentDidMount: function() {
    EventLogStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    EventLogStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(EventLogStore.getDataStore());
  },
  render: function() {
    return (
      <div>
        <div className="highlighted">Event Logs</div>
        <br />
        {this.state.list.map(item => (
          <EventLogItem
            key={item.id}
            item={item}
          />
        ))}
        <br />
      </div>
    );
  }
});

function EventLogItem(props) {
  const {item} = props;
  return (
    <div>
      <label>
        {item.transactionHash}
      </label>
    </div>
  );
}

module.exports = EventLogs;

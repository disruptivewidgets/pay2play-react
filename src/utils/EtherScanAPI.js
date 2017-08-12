var SearchServerActions = require('../actions/SearchServerActions');
var request = require('superagent');

module.exports = {
  findItems: function(query) {
    request.post('http://www.hypewizard.com/api/ask_amazon')
      .send({query: query})
      .set('Accept', 'application/json')
      .end(function(err, response) {
        if (err) return console.error(err);

        SearchServerActions.receiveSearchResults(response.body);
      });
  }
};

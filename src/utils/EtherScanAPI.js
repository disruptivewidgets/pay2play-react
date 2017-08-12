var request = require('superagent');

module.exports = {
  findItems: function(query) {
    request.post('')
      .send({query: query})
      .set('Accept', 'application/json')
      .end(function(err, response) {
        if (err) return console.error(err);

        // SearchServerActions.receiveSearchResults(response.body);
      });
  }
};

var GameServerActions = require('../actions/GameServerActions');

function getGames() {
  setTimeout(function() {
    const games = [
      {
        id: 0,
        title: "Hearthstone",
        referenceHash: window.web3.utils.sha3("0")
      },
      {
        id: 1,
        title: "Fortnite",
        referenceHash: window.web3.utils.sha3("1")
      },
      {
        id: 2,
        title: "League Of Legends",

        referenceHash: window.web3.utils.sha3("2")
      },
      {
        id: 3,
        title: "Starcraft",
        referenceHash: window.web3.utils.sha3("3")
      },
      {
        id: 4,
        title: "Masters Of Conquest",
        referenceHash: window.web3.utils.sha3("4")
      }
    ];

    GameServerActions.receivedGames(games);
  }, 1000);
}

module.exports = {
  getGames: getGames
};

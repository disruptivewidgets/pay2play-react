import Immutable from 'immutable';

const DiscordUser = Immutable.Record({
  id: '',
  discordId: '',
  discordUsername: '',
  discordDiscriminator: '',
  ethereumAddress: ''
});

export default DiscordUser;

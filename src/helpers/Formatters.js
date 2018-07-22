var Formatter = {};

Formatter.formatAddress = function formatAddress(address)
{
  let head = address.substring(0, 8);
  let tail = address.substring(address.length - 8, address.length);
  address = head + '...' + tail;
  return address
}

Formatter.formatRulesHash = function formatRulesHash(address)
{
  let head = address.substring(0, 8);
  let tail = address.substring(address.length - 8, address.length);
  address = head + '...' + tail;
  return address
}

Formatter.formatTransactionHash = function formatTransactionHash(address)
{
  let head = address.substring(0, 8);
  let tail = address.substring(address.length - 8, address.length);
  address = head + '...' + tail;
  return address
}
export default Formatter;

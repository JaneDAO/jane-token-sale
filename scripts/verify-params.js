const { settings } = require('./utils');

const [
  janeToken,
  janeEscrow,
  priceFeed,
  janePerUSD,
  owner,
  hedgeyBatchPlanner,
  hedgeyVotingTokenLockUpPlan,
] = settings([
  'JANE_TOKEN',
  'JANE_ESCROW',
  'PRICE_FEED',
  'JANE_PER_USD',
  'OWNER',
  'HEDGEY_BATCH_PLANNER',
  'HEDGEY_VOTING_TOKEN_LOCKUP_PLAN',
]);

module.exports = [
  janeToken,
  janeEscrow,
  priceFeed,
  janePerUSD,
  owner,
  hedgeyBatchPlanner,
  hedgeyVotingTokenLockUpPlan
];
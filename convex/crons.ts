import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'expire stories',
  { hours: 1 },
  internal.cronsImpl.expireStories
);
crons.daily(
  'sync github following',
  { hourUTC: 6, minuteUTC: 0 },
  internal.cronsImpl.syncGitHubFollowing
);

export default crons;

// Add a follow command.
// It takes a single url argument and creates a new feed follow record for the current user.
// It should print the name of the feed and the current user once the record is created (which the query we just made should support).
// You'll need a query to look up feeds by URL.

import { createFeedFollow, getFeedByUrl } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export const handlerFollow = async (cmdName: string, user: User, ...args: string[]): Promise<void> => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed with URL ${url} not found`);
  }

  const result = await createFeedFollow(user.id, feed.id);

  console.log(`Feed: ${result?.feedName}`);
  console.log(`User: ${result?.userName}`);
};

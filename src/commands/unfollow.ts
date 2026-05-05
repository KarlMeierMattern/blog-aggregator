import { deleteFeedFollow } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export const handlerUnfollow = async (cmdName: string, user: User, ...args: string[]): Promise<void> => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];
  await deleteFeedFollow(user.id, url);
  console.log(`Unfollowed ${url}`);
};

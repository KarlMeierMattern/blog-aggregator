import { getFeedFollowsForUser } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export const handlerFollowing = async (_cmdName: string, user: User): Promise<void> => {
  const follows = await getFeedFollowsForUser(user.id);

  if (follows.length === 0) {
    console.log("You are not following anyone");
    return;
  }

  for (const follow of follows) {
    console.log(`* ${follow.feedName}`);
  }
};

import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/schema";

export const handlerBrowse = async (
  _cmdName: string,
  user: User,
  limitStr?: string
): Promise<void> => {
  const limit = limitStr ? parseInt(limitStr) : 2;
  const userPosts = await getPostsForUser(user.id, limit);

  if (userPosts.length === 0) {
    console.log("No posts found. Follow some feeds and run agg first.");
    return;
  }

  for (const post of userPosts) {
    console.log(`\n--- ${post.title}`);
    console.log(`    ${post.url}`);
    if (post.publishedAt) {
      console.log(`    Published: ${post.publishedAt.toDateString()}`);
    }
    if (post.description) {
      console.log(`    ${post.description.slice(0, 120)}...`);
    }
  }
};

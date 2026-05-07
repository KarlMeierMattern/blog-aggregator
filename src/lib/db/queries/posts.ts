import { db } from "..";
import { desc, eq } from "drizzle-orm";
import { posts, feedFollows } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createPost(
  title: string,
  url: string,
  feedId: string,
  description?: string,
  publishedAt?: Date
) {
  const result = await db
    .insert(posts)
    .values({ title, url, feedId, description, publishedAt })
    .onConflictDoNothing()
    .returning();

  return firstOrUndefined(result);
}

export async function getPostsForUser(userId: string, limit: number = 2) {
  return db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

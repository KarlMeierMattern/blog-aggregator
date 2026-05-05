import { db } from "..";
import { and, eq } from "drizzle-orm";
import { feeds, feedFollows, users } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeed(
  feedName: string,
  url: string,
  userId: string
) {
  const result = await db
    .insert(feeds)
    .values({
      name: feedName,
      url,
      userId,
    })
    .returning();

  return firstOrUndefined(result);
}

export async function getFeeds() {
  return db.select().from(feeds);
}

export async function getFeedById(id: string) {
  const result = await db.select().from(feeds).where(eq(feeds.id, id));
  return firstOrUndefined(result);
}

// Once a user adds a feed they also want to follow it.
// createFeedFollow allows the user to follow the feed they just created — it adds a row to feed_follows linking their userId to the new feedId
export async function createFeedFollow(userId: string, feedId: string) {
  const [feedFollow] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();

  if (!feedFollow) return undefined;

  const result = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, feedFollow.id)); // We only want the single record we just inserted

  return firstOrUndefined(result);
}

export async function getFeedByUrl(url: string) {
  const feedId = await db.select().from(feeds).where(eq(feeds.url, url));

  return firstOrUndefined(feedId);
}

export async function getFeedFollowsForUser(userId: string) {
  return db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));
}

export async function deleteFeedFollow(userId: string, url: string) {
  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed with URL ${url} not found`);
  }

  await db
    .delete(feedFollows)
    .where(
      and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feed.id))
    );
}

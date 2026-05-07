import { fetchFeed } from "src/lib/db/rss";
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost } from "src/lib/db/queries/posts";

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
};

const parseDuration = (durationStr: string): number => {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    throw new Error(
      `Invalid duration "${durationStr}". Use a format like 1s, 30s, 1m, 1h`
    );
  }
  const value = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
};

export const handlerAgg = async (_cmdName: string, durationStr: string) => {
  const timeBetweenRequests = parseDuration(durationStr);
  console.log(`Collecting feeds every ${durationStr}`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
};

export const scrapeFeeds = async () => {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed || !nextFeed.url) {
    console.log("No feeds to fetch");
    return;
  }

  await markFeedFetched(nextFeed.id);

  const feedData = await fetchFeed(nextFeed.url);
  for (const item of feedData.channel.item) {
    const publishedAt = item.pubDate ? new Date(item.pubDate) : undefined;
    await createPost(
      item.title,
      item.link,
      nextFeed.id,
      item.description,
      publishedAt
    );
  }
  console.log(`Saved posts from ${nextFeed.name ?? nextFeed.url}`);
};

import { fetchFeed } from "src/lib/db/rss";

export const handlerAgg = async (_: string) => {
  const feedUrl = "https://www.wagslane.dev/index.xml";
  const feedData = await fetchFeed(feedUrl);
  const feedDataStr = JSON.stringify(feedData, null, 2);
  console.log(feedDataStr);
};

import { fetchFeed } from "src/lib/db/rss";

export const handlerAgg = async (_: string) => {
  const feedUrl = "https://www.wagslane.dev/index.xml";
  const feedData = await fetchFeed(feedUrl);
  const feedDataStr = JSON.stringify(feedData, null, 2);
  console.log(feedDataStr);
};

/*
Add an agg command.
Later this will be our long-running aggregator service.
For now, we'll just use it to fetch a single feed and ensure our parsing works. It should fetch the feed found at https://www.wagslane.dev/index.xml and print the entire object to the console.
*/

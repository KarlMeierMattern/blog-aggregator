import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export const fetchFeed = async (url: string): Promise<RSSFeed> => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "gator", // setting the User-Agent header is a common practice to identify your program to the server
      accept: "application/rss+xml",
    },
  });
  const data = await response.text();

  const parser = new XMLParser({ processEntities: false });
  const parsed = parser.parse(data);

  const channel = parsed?.rss?.channel;

  if (!channel) {
    throw new Error("Invalid RSS feed: missing channel");
  }

  const { title, link, description } = channel;

  if (!title || !link || !description) {
    throw new Error("Invalid RSS fedd: missing channel metadata");
  }

  let itemArray: RSSItem[];

  if (Array.isArray(channel.item)) {
    itemArray = channel.item;
  } else if (channel.item) {
    itemArray = [channel.item];
  } else {
    itemArray = [];
  }

  const items: RSSItem[] = itemArray
    .filter(
      (item: RSSItem) =>
        item.title && item.link && item.description && item.pubDate
    )
    .map((item: RSSItem) => ({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    }));

  return {
    channel: {
      title: title,
      link: link,
      description: description,
      item: items,
    },
  };
};

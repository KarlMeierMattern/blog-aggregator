// psql postgres
// \c gator

import type { CommandsRegistry } from "./commands/commands";
import { registerCommand, runCommand } from "./commands/commands";
import {
  handlerLogin,
  handlerRegister,
  reset,
  getAllUsers,
} from "./commands/users";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed } from "./commands/feeds";
import { handlerListFeeds } from "./commands/feeds";
import { handlerFollow } from "./commands/follow";
import { handlerFollowing } from "./commands/following";
import { handlerUnfollow } from "./commands/unfollow";
import { handlerBrowse } from "./commands/browse";
import { middlewareLoggedIn } from "./auth";

async function main() {
  const args = process.argv.slice(2); //process.argv = ["node", "tsx src/index.ts", "addfeed", "Hacker News RSS", "https://hnrss.org/newest"]

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand("login", commandsRegistry, handlerLogin);
  registerCommand("register", commandsRegistry, handlerRegister);
  registerCommand("reset", commandsRegistry, reset);
  registerCommand("users", commandsRegistry, getAllUsers);
  registerCommand("agg", commandsRegistry, handlerAgg);
  registerCommand("feeds", commandsRegistry, handlerListFeeds);
  registerCommand(
    "addfeed",
    commandsRegistry,
    middlewareLoggedIn(handlerAddFeed)
  );
  registerCommand(
    "follow",
    commandsRegistry,
    middlewareLoggedIn(handlerFollow)
  );
  registerCommand(
    "following",
    commandsRegistry,
    middlewareLoggedIn(handlerFollowing)
  );
  registerCommand(
    "unfollow",
    commandsRegistry,
    middlewareLoggedIn(handlerUnfollow)
  );
  registerCommand(
    "browse",
    commandsRegistry,
    middlewareLoggedIn(handlerBrowse)
  );

  if (args.length === 0) {
    console.error("No command provided");
    process.exit(1);
  }

  try {
    await runCommand(cmdName, commandsRegistry, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(`Error running command ${cmdName}: ${error}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();

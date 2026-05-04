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

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args[1];
  const commandsRegistry: CommandsRegistry = {};

  registerCommand("login", commandsRegistry, handlerLogin);
  registerCommand("register", commandsRegistry, handlerRegister);
  registerCommand("reset", commandsRegistry, reset);
  registerCommand("users", commandsRegistry, getAllUsers);
  registerCommand("agg", commandsRegistry, handlerAgg);

  if (args.length === 0) {
    console.error("No command provided");
    process.exit(1);
  }

  try {
    await runCommand(cmdName, commandsRegistry, cmdArgs);
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

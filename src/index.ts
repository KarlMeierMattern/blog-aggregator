/*
In the main function, remove the manual update of the config file. Whenever we need the config in our handlers, we'll just read from it again.
Create a new CommandsRegistry object.
Register a handler function for the login command.
Use process.argv to get the command-line arguments passed in by the user. Have a look at the arguments and remove any you don't need.
After slicing the arguments, if there isn't at least one argument, print an error message to the terminal and exit with code 1.
Split the command-line arguments into the command name and the arguments array. Use the runCommand function to run the given command and print any errors that are thrown.
*/

import type { CommandsRegistry } from "./commands";
import { registerCommand, handlerLogin, runCommand } from "./commands";

const commandsRegistry: CommandsRegistry = {};

function main() {
  registerCommand("login", commandsRegistry, handlerLogin);

  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("No command provided");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;
  try {
    runCommand(cmdName, commandsRegistry, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      process.exit(1);
    }
  }
}

main();

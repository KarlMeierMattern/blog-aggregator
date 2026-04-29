import { setUser } from "./config";

export type CommandsRegistry = Record<string, CommandHandler>;
export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export const handlerLogin: CommandHandler = (
  cmdName: string,
  ...args: string[]
) => {
  if (args.length === 0) {
    throw new Error(`${cmdName} expects a single argument`);
  }

  setUser(args[0]);

  console.log(`Username set to ${args[0]}`);
};

export const registerCommand = (
  cmdName: string,
  registry: CommandsRegistry,
  handler: CommandHandler
) => {
  // This function registers a new handler function for a command name.
  if (registry[cmdName]) {
    throw new Error(`Command ${cmdName} is already registered`);
  }
  registry[cmdName] = handler;
};

export const runCommand = (
  cmdName: string,
  registry: CommandsRegistry,
  ...args: string[]
) => {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  handler(cmdName, ...args);
};

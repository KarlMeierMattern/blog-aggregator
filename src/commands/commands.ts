export type CommandsRegistry = Record<string, CommandHandler>;
export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export const registerCommand = (
  cmdName: string,
  registry: CommandsRegistry,
  handler: CommandHandler
) => {
  // This function registers a new handler function for a command name
  if (registry[cmdName]) {
    throw new Error(`Command ${cmdName} is already registered`);
  }
  registry[cmdName] = handler;
};

export const runCommand = async (
  cmdName: string,
  registry: CommandsRegistry,
  ...args: string[]
) => {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  await handler(cmdName, ...args);
};

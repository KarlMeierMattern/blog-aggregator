import { CommandHandler } from "./commands/commands";
import { getUser } from "src/lib/db/queries/users";
import { readConfig } from "./config";
import { User } from "src/lib/db/schema";

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export const middlewareLoggedIn = (
  handler: UserCommandHandler
): CommandHandler => {
  // define the function signature of the returned inner function
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = readConfig();
    const user = await getUser(config.currentUserName);

    if (!user) {
      throw new Error(`User ${config.currentUserName} not found`);
    }

    await handler(cmdName, user, ...args); // invoke the function
  };
};

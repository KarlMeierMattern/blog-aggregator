import type { CommandHandler } from "./commands";
import { readConfig, setUser } from "src/config";
import { createUser, deleteUsers, getUsers } from "src/lib/db/queries/users";

export const handlerLogin: CommandHandler = async (
  cmdName: string,
  ...args: string[]
) => {
  if (args.length !== 1) {
    throw new Error(`${cmdName} expects a single argument`);
  }

  const user = args[0];
  setUser(user);
  console.log("User switched successfully");
};

export const handlerRegister: CommandHandler = async (
  cmdName: string,
  ...args: string[]
) => {
  if (args.length != 1) {
    throw new Error(`Usage: ${cmdName} <name>`);
  }

  const user = args[0];
  const existingUser = await createUser(user);

  if (!user) {
    throw new Error(`User ${user} not found`);
  }

  setUser(existingUser.name);
  console.log("User created successfully!");
};

export const reset = async () => {
  await deleteUsers();
};

export const getAllUsers = async () => {
  const users = await getUsers();
  const config = readConfig();

  for (const user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
};

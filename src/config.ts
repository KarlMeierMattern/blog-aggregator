import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

/*
~/.gatorconfig.json serves as a lightweight, persistent configuration file for the CLI application. It stores two key pieces of state:
- db_url - the connection string to the database, so you don't have to pass it as an argument every time you run a command.
- current_user_name - tracks which user is currently "logged in," so the CLI knows whose session is active across separate invocations.
*/

const getConfigFilePath = (): string => {
  return path.join(os.homedir(), ".gatorconfig.json");
};

export const setUser = (username: string) => {
  const config = readConfig();
  config.currentUserName = username;
  writeConfig(config);
};

export const readConfig = (): Config => {
  const configFile = path.join(os.homedir(), ".gatorconfig.json");
  const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
  return validateConfig(config);
};

const validateConfig = (rawConfig: any): Config => {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("dbUrl is required");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("currentUserName is required");
  }
  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
  return config;
};

export const writeConfig = (config: Config) => {
  const fullPath = getConfigFilePath();

  const rawConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };

  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
};

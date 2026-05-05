import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

// Array destructuring is used to get the first item from the returned array.
// This is because drizzle returns an array of results, even if there is only one result.
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(result);
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUsers() {
  return db.select({ name: users.name }).from(users);
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return firstOrUndefined(result);
}

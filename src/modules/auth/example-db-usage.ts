// Example only: demonstrates how you could use the Drizzle db
// This is NOT wired into controllers; adapt inside services when you implement.
import { users } from '../../db/schema';
import type { Database } from '../../plugins/db';

export async function findUserByEmail(db: Database, email: string) {
  const rows = await db.select().from(users).where(users.email.eq(email));
  return rows[0] || null;
}

export async function createUser(db: Database, email: string, passwordHash: string) {
  const [inserted] = await db.insert(users).values({ email, passwordHash }).returning();
  return inserted;
}

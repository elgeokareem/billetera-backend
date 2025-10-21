import { Elysia } from 'elysia';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';

// Simple Postgres pool; adjust max/connections as needed
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/app_db',
});

// Drizzle instance with schema for typed queries
export const db = drizzle(pool, { schema });

export const dbPlugin = new Elysia({ name: 'db' })
  .decorate('db', db)
  .onStop(() => {
    void pool.end();
  })
  .as('global');

export type Database = typeof db;

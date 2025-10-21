import { pgTable, serial, varchar, timestamp, integer, doublePrecision, pgEnum } from 'drizzle-orm/pg-core';

// Enum equivalent for the Go check constraint wallet_type IN ('spot','fund')
const walletTypeEnum = pgEnum('wallet_type_enum', ['spot', 'fund']);

// User model translated from Go `User` struct
// Go fields: ID (uint primary key), Email, Password, BinanceToken, CreatedAt, UpdatedAt
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  binanceToken: varchar('binance_token', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// BinanceWallet model translated from Go `BinanceWallet` struct
// Go fields: ID, UserID, WalletType (check constraint), Asset, Free, Locked, Freeze, Usd, CreatedAt, UpdatedAt, User
export const binanceWallets = pgTable('binance_wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  walletType: walletTypeEnum('wallet_type').notNull(),
  asset: varchar('asset', { length: 64 }).notNull(),
  free: doublePrecision('free').default(0).notNull(),
  locked: doublePrecision('locked').default(0).notNull(),
  freeze: doublePrecision('freeze').default(0).notNull(),
  usd: varchar('usd', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type BinanceWallet = typeof binanceWallets.$inferSelect;
export type NewBinanceWallet = typeof binanceWallets.$inferInsert;

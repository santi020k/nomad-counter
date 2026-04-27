import { relations } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const loginCodes = sqliteTable('login_codes', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  codeHash: text('code_hash').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  consumedAt: integer('consumed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
}, table => [
  index('idx_login_codes_email').on(table.email),
  index('idx_login_codes_expires_at').on(table.expiresAt)
])

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
}, table => [
  index('idx_sessions_user_id').on(table.userId),
  index('idx_sessions_expires_at').on(table.expiresAt)
])

export const homeCountries = sqliteTable('home_countries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  countryCode: text('country_code').notNull(),
  countryName: text('country_name').notNull(),
  thresholdDays: integer('threshold_days').notNull().default(183),
  warningDays: integer('warning_days').notNull().default(14),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
}, table => [
  uniqueIndex('idx_home_countries_user_country_unique').on(table.userId, table.countryCode),
  index('idx_home_countries_user_id').on(table.userId)
])

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  countryCode: text('country_code').notNull(),
  countryName: text('country_name').notNull(),
  entryDate: text('entry_date').notNull(),
  exitDate: text('exit_date'),
  note: text('note'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
}, table => [
  index('idx_trips_user_id').on(table.userId),
  index('idx_trips_country_code').on(table.countryCode),
  index('idx_trips_dates').on(table.entryDate, table.exitDate)
])

export const usersRelations = relations(users, ({ many }) => ({
  homeCountries: many(homeCountries),
  sessions: many(sessions),
  trips: many(trips)
}))

export const homeCountriesRelations = relations(homeCountries, ({ one }) => ({
  user: one(users, {
    fields: [homeCountries.userId],
    references: [users.id]
  })
}))

export const tripsRelations = relations(trips, ({ one }) => ({
  user: one(users, {
    fields: [trips.userId],
    references: [users.id]
  })
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type HomeCountry = typeof homeCountries.$inferSelect
export type NewHomeCountry = typeof homeCountries.$inferInsert
export type Trip = typeof trips.$inferSelect
export type NewTrip = typeof trips.$inferInsert

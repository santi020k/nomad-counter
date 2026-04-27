import { drizzle } from 'drizzle-orm/d1'

import * as schema from '@nomad-counter/db'

export const createDb = (database: D1Database) => drizzle(database, { schema })

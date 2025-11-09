import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';

const client = postgres(process.env.SUPABASE_DB_URL!, { max: 10 });
export const db = drizzle(client, { schema });
export type Database = typeof db;
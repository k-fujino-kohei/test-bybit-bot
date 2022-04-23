import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js'
import { Schema, Table, Values } from './schema'

export class DataStore {
  private readonly supabase: SupabaseClient

  constructor (url: string, key: string, options?: SupabaseClientOptions) {
    this.supabase = createClient(url, key, { shouldThrowOnError: true, ...options })
  }

  async insert <T extends Schema> (table: Table<T>, values: Values<T>) {
    await this.supabase.from(table).insert(values)
  }

  async rpc<T> (fn: string, params?: object): Promise<{ data: T[] | null, count: number | null }> {
    return await this.supabase.rpc(fn, params)
  }
}

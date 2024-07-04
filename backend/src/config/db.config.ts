import { registerAs } from '@nestjs/config'

declare interface DatabaseConfig {
  url?: string
}

export const dbConfig = registerAs<DatabaseConfig>(
  'db',
  (): DatabaseConfig => ({
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:postgres@127.0.0.1:5432/crm_uc',
  }),
)

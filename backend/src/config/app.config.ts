declare interface AppConfigOptions {
  mode?: string
  name?: string
  host?: string
  port?: number
}

export const appConfig: AppConfigOptions = {
  mode: process.env.APP_MODE ?? 'development',
  name: process.env.APP_NAME ?? 'geteway',
  host: process.env.APP_HOST ?? '127.0.0.1',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 7777,
}

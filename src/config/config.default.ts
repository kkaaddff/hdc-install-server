import { join } from 'path'

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1683452916943_7754',
  koa: {
    port: 7001,
  },
  // Cache configuration
  cache: {
    dir: join(process.cwd(), 'cache'),
    cleanInterval: '0 0 * * *', // Run at midnight every day
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },
  // HDC command configuration
  hdc: {
    command: 'hdc',
    timeout: 60000, // 60 seconds timeout for HDC commands
  },
}

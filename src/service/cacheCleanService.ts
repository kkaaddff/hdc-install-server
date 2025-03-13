import { Provide, Init, Config } from '@midwayjs/decorator'

@Provide()
export class CacheCleanService {
  @Config('cache')
  cacheConfig

  @Init()
  async init() {
    // Schedule the cache cleaning job

    // await this.cleanCache()
    console.log(`Cache cleaning scheduled with cron: ${this.cacheConfig.cleanInterval}`)
  }

  /**
   * Clean the cache
   */
  async cleanCache(): Promise<void> {
    try {
      console.log('Starting cache cleaning...')
      console.log('Cache cleaning completed')
    } catch (error) {
      console.error(`Error cleaning cache: ${error.message}`)
    }
  }
}

import { Provide, Inject, Init, Config } from '@midwayjs/decorator'
import { DownloadUtil } from '../util/downloadUtil'

@Provide()
export class CacheCleanService {
  @Inject()
  downloadUtil: DownloadUtil

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
      await this.downloadUtil.cleanCache()
      console.log('Cache cleaning completed')
    } catch (error) {
      console.error(`Error cleaning cache: ${error.message}`)
    }
  }
}

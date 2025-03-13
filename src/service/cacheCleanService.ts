import { Provide, Inject, Init, Config } from '@midwayjs/decorator'
import { DownloadUtil } from '../util/downloadUtil'
import * as schedule from 'node-schedule'

@Provide()
export class CacheCleanService {
  @Inject()
  downloadUtil: DownloadUtil

  @Config('cache')
  cacheConfig

  private job: schedule.Job

  @Init()
  async init() {
    // Schedule the cache cleaning job
    this.job = schedule.scheduleJob(this.cacheConfig.cleanInterval, async () => {
      console.log('Running scheduled cache cleaning...')
      await this.cleanCache()
    })

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

  /**
   * Get the next scheduled run time
   */
  getNextRunTime(): Date | null {
    return this.job ? this.job.nextInvocation() : null
  }
}

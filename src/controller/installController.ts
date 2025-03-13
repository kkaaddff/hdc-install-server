import { Inject, Controller, Post, Get, Body } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { Validate } from '@midwayjs/validate'
import { InstallService } from '../service/installService'
import { CacheCleanService } from '../service/cacheCleanService'
import { InstallAppDTO } from '../interface'

@Controller('/api')
export class InstallController {
  @Inject()
  ctx: Context

  @Inject()
  installService: InstallService

  @Inject()
  cacheCleanService: CacheCleanService

  /**
   * Install an application on a device
   * @param installDto Installation parameters
   */
  @Post('/install')
  @Validate()
  async install(@Body() installDto: InstallAppDTO) {
    const result = await this.installService.installApp(installDto)
    return result
  }

  /**
   * Get the status of the installation lock
   */
  @Get('/status')
  async getStatus() {
    return {
      lock: this.installService.getLockStatus(),
      nextCacheClean: this.cacheCleanService.getNextRunTime(),
    }
  }

  /**
   * Manually clean the cache
   */
  @Post('/clean-cache')
  async cleanCache() {
    await this.cacheCleanService.cleanCache()
    return {
      success: true,
      message: 'Cache cleaning completed',
    }
  }

  /**
   * Get information about the cache
   */
  @Get('/cache-info')
  async getCacheInfo() {
    const cacheInfo = await this.installService.getCacheInfo()
    return {
      count: cacheInfo.length,
      files: cacheInfo,
    }
  }
}

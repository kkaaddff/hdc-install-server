import { Body, Controller, Get, Inject, Post } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { ApiOperation } from '@midwayjs/swagger'
import { InstallAppDTO } from '../interface'
import { InstallService } from '../service/installService'
import { BuildController } from './buildController'

@Controller('/harmony')
export class InstallController {
  @Inject()
  ctx: Context

  @Inject()
  installService: InstallService

  @Inject()
  buildController: BuildController

  /**
   * Install an application on a device
   * @param installDto Installation parameters
   */
  @ApiOperation({ summary: '安装 App 应用' })
  @Post('/install')
  async install(@Body() installDto: InstallAppDTO) {
    const result = await this.installService.installApp(installDto)
    return result
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

  /**
   * Get information about the lock status
   */
  @Get('/lock-status')
  async getLockStatus() {
    const lockInfo = this.installService.getLockStatus()
    return lockInfo
  }
}

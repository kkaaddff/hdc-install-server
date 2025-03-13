import { Inject, Controller, Post, Get, Body } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { InstallService } from '../service/installService'
import { InstallAppDTO } from '../interface'
import { ApiOperation } from '@midwayjs/swagger'

@Controller('/api')
export class InstallController {
  @Inject()
  ctx: Context

  @Inject()
  installService: InstallService

  /**
   * Install an application on a device
   * @param installDto Installation parameters
   */
  @ApiOperation({ summary: '安装 App 应用' })
  @Post('/install')
  async install(@Body() installDto: InstallAppDTO) {
    debugger
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
}

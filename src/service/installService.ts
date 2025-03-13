import { Provide, Inject } from '@midwayjs/decorator'
import { HdcUtil } from '../util/hdcUtil'
import { DownloadUtil } from '../util/downloadUtil'
import { LockUtil } from '../util/lockUtil'
import { InstallAppDTO, InstallResult } from '../interface'

@Provide()
export class InstallService {
  @Inject()
  hdcUtil: HdcUtil

  @Inject()
  downloadUtil: DownloadUtil

  /**
   * Install an application on a device
   * @param installDto Installation parameters
   * @returns Installation result
   */
  async installApp(installDto: InstallAppDTO): Promise<InstallResult> {
    try {
      // Try to acquire the lock
      try {
        await LockUtil.acquireLock()
      } catch (error) {
        return {
          success: false,
          message: `Installation is already in progress. Please try again later. ${error.message}`,
        }
      }

      try {
        // Download the application
        console.log(`Downloading application from ${installDto.appUrl}`)
        const appPath = await this.downloadUtil.downloadFile(installDto.appUrl)

        // Install the application on the device
        console.log(
          `Installing application to device ${installDto.deviceIp}:${installDto.devicePort}`
        )
        const installResult = await this.hdcUtil.installApp(
          appPath,
          installDto.deviceIp,
          installDto.devicePort
        )

        // Disconnect from the device
        await this.hdcUtil.disconnectDevice(installDto.deviceIp, installDto.devicePort)

        return {
          success: true,
          message: `Application installed successfully: ${installResult}`,
          appPath,
        }
      } finally {
        // Always release the lock
        LockUtil.releaseLock()
      }
    } catch (error) {
      console.error(`Error installing application: ${error.message}`)

      // Make sure to release the lock in case of error
      LockUtil.releaseLock()

      return {
        success: false,
        message: `Failed to install application: ${error.message}`,
      }
    }
  }

  /**
   * Get the status of the installation lock
   * @returns Lock status information
   */
  getLockStatus(): { locked: boolean; queueLength: number } {
    return {
      locked: LockUtil.isLockHeld(),
      queueLength: LockUtil.getQueueLength(),
    }
  }

  /**
   * Clean the cache
   */
  async cleanCache(): Promise<void> {
    await this.downloadUtil.cleanCache()
  }

  /**
   * Get cache information
   */
  async getCacheInfo() {
    return this.downloadUtil.getCacheInfo()
  }
}

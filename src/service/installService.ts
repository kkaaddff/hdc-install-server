import { Provide, Inject } from '@midwayjs/decorator'
import { HdcUtil } from '../util/hdcUtil'
import { LockUtil } from '../util/lockUtil'
import { InstallAppDTO, InstallResult } from '../interface'
import fs from 'fs'
import path from 'path'
import extract from 'extract-zip'

@Provide()
export class InstallService {
  @Inject()
  hdcUtil: HdcUtil

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
        //  "downloadUrl": "/filesCache/YMMShipper_debug_origin/release-20250327_49_1741861703663.zip"
        console.log(`Install application from ${installDto.downloadUrl}`)

        // Get the absolute path of the zip file
        const zipFilePath = path.join(process.cwd(), installDto.downloadUrl)
        const extractDir = path.dirname(zipFilePath)

        // Create extraction directory if it doesn't exist
        if (!fs.existsSync(extractDir)) {
          // Extract the zip file
          console.log(`Extracting ${zipFilePath} to ${extractDir}`)
          await extract(zipFilePath, { dir: extractDir })
        }

        // Find all .hap files in the extracted directory
        let hapFile = null

        const findHapFile = (dir: string) => {
          if (hapFile) return

          const files = fs.readdirSync(dir)

          for (const file of files) {
            if (hapFile) return

            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)

            if (stat.isDirectory()) {
              findHapFile(filePath)
            } else if (path.extname(file).toLowerCase() === '.hap') {
              hapFile = filePath
              return
            }
          }
        }

        findHapFile(extractDir)

        if (!hapFile) {
          throw new Error('No .hap file found in the extracted package')
        }

        console.log(`Found .hap file: ${hapFile}`)

        // Use the found .hap file for installation
        const appPath = hapFile
        // Install the application on the device
        console.log(`Using ${appPath} for installation`)
        console.log(
          `Installing application to device ${installDto.deviceIp}:${installDto.devicePort}`
        )
        const installResult = await this.hdcUtil.installApp(
          appPath,
          installDto.deviceIp,
          installDto.devicePort
        )

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
  async cleanCache(): Promise<void> {}

  /**
   * Get cache information
   */
  async getCacheInfo() {
    return []
  }
}

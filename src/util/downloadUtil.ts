import { Config, Provide } from '@midwayjs/decorator'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'
import { createWriteStream } from 'fs'
import { promisify } from 'util'
import { CacheInfo } from '../interface'

const fsExists = promisify(fs.exists)
const fsReaddir = promisify(fs.readdir)
const fsStat = promisify(fs.stat)
const fsUnlink = promisify(fs.unlink)

@Provide()
export class DownloadUtil {
  @Config('cache')
  cacheConfig

  /**
   * Download a file from a URL to the cache directory
   * @param url URL to download from
   * @returns Path to the downloaded file
   */
  async downloadFile(url: string): Promise<string> {
    // Extract filename from URL
    const fileName = this.getFileNameFromUrl(url)
    const filePath = path.join(this.cacheConfig.dir, fileName)

    // Check if file already exists in cache
    if (await fsExists(filePath)) {
      console.log(`File ${fileName} already exists in cache, skipping download`)
      return filePath
    }

    try {
      // Download the file
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
      })

      // Save the file to disk
      const writer = createWriteStream(filePath)
      response.data.pipe(writer)

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`File ${fileName} downloaded successfully`)
          resolve(filePath)
        })
        writer.on('error', (err) => {
          console.error(`Error writing file: ${err.message}`)
          reject(err)
        })
      })
    } catch (error) {
      console.error(`Error downloading file: ${error.message}`)
      throw new Error(`Failed to download file: ${error.message}`)
    }
  }

  /**
   * Extract filename from URL
   * @param url URL
   * @returns Filename
   */
  private getFileNameFromUrl(url: string): string {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const fileName = path.basename(pathname)

    // If no filename is found, generate a unique name
    if (!fileName || fileName === '') {
      return `app_${Date.now()}.hap`
    }

    return fileName
  }

  /**
   * Clean old files from the cache directory
   */
  async cleanCache(): Promise<void> {
    const now = Date.now()
    const maxAge = this.cacheConfig.maxAge

    try {
      const files = await fsReaddir(this.cacheConfig.dir)

      for (const file of files) {
        const filePath = path.join(this.cacheConfig.dir, file)
        const stats = await fsStat(filePath)

        // Check if the file is older than maxAge
        if (now - stats.mtimeMs > maxAge) {
          await fsUnlink(filePath)
          console.log(`Deleted old cache file: ${file}`)
        }
      }
    } catch (error) {
      console.error(`Error cleaning cache: ${error.message}`)
    }
  }

  /**
   * Get information about all files in the cache
   * @returns Array of cache file information
   */
  async getCacheInfo(): Promise<CacheInfo[]> {
    try {
      const files = await fsReaddir(this.cacheConfig.dir)
      const cacheInfo: CacheInfo[] = []

      for (const file of files) {
        const filePath = path.join(this.cacheConfig.dir, file)
        const stats = await fsStat(filePath)

        cacheInfo.push({
          filePath,
          fileName: file,
          createdAt: stats.mtimeMs,
        })
      }

      return cacheInfo
    } catch (error) {
      console.error(`Error getting cache info: ${error.message}`)
      return []
    }
  }
}

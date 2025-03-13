export interface InstallAppDTO {
  appUrl: string
  deviceIp: string
  devicePort: number
}

export interface InstallResult {
  success: boolean
  message: string
  appPath?: string
}

export interface CacheInfo {
  filePath: string
  fileName: string
  createdAt: number
}

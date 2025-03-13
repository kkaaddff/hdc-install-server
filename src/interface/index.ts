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

export interface BuildRecordInfo {
  id: number
  appName: string
  buildType: string
  branch: string
  buildTime: Date
  buildNumber: string
  fileName: string
  createdAt: Date
  downloadUrl: string
}

export interface BuildQueryResult {
  records: BuildRecordInfo[]
  total: number
  page: number
  pageSize: number
}

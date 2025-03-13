import { UploadFileInfo } from '@midwayjs/busboy'
import { App, Config } from '@midwayjs/core'
import { Provide } from '@midwayjs/decorator'
import { Application } from '@midwayjs/koa'
import { InjectEntityModel } from '@midwayjs/typeorm'
import * as fs from 'fs-extra'
import * as path from 'path'
import { Repository } from 'typeorm'
import { BuildQueryDTO, BuildUploadDTO } from '../dto/buildDto'
import { BuildRecord } from '../entity/buildRecord.entity'

@Provide()
export class BuildService {
  @InjectEntityModel(BuildRecord)
  buildRecordModel: Repository<BuildRecord>

  @App()
  app: Application

  @Config('cache')
  cacheConfig: { dir: string; maxAge: number }

  /**
   * Save build record and file
   */
  async saveBuildRecord(buildInfo: BuildUploadDTO, file: UploadFileInfo): Promise<BuildRecord> {
    // Move the file to the cache directory with a more descriptive name
    const fileName = `${buildInfo.appName}_${buildInfo.buildType}_${buildInfo.branch}_${
      buildInfo.buildNumber
    }_${Date.now()}${path.extname(file.filename)}`
    const targetPath = path.join(this.cacheConfig.dir, fileName)

    await fs.move(file.data, targetPath, { overwrite: true })

    // Create and save the build record
    const buildRecord = new BuildRecord()
    buildRecord.appName = buildInfo.appName
    buildRecord.buildType = buildInfo.buildType
    buildRecord.branch = buildInfo.branch
    buildRecord.buildTime = buildInfo.buildTime
    buildRecord.buildNumber = buildInfo.buildNumber
    buildRecord.filePath = targetPath
    buildRecord.fileName = fileName

    return this.buildRecordModel.save(buildRecord)
  }

  /**
   * Query build records
   */
  async queryBuildRecords(
    query: BuildQueryDTO
  ): Promise<{ records: BuildRecord[]; total: number }> {
    const { appName, buildType, branch, page = 1, pageSize = 10 } = query

    // Build the query
    const queryBuilder = this.buildRecordModel.createQueryBuilder('record')

    if (appName) {
      queryBuilder.andWhere('record.appName = :appName', { appName })
    }

    if (buildType) {
      queryBuilder.andWhere('record.buildType = :buildType', { buildType })
    }

    if (branch) {
      queryBuilder.andWhere('record.branch = :branch', { branch })
    }

    // Get total count
    const total = await queryBuilder.getCount()

    // Get paginated results
    const records = await queryBuilder
      .orderBy('record.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany()

    return { records, total }
  }

  /**
   * Get build record by ID
   */
  async getBuildRecordById(id: number): Promise<BuildRecord> {
    return this.buildRecordModel.findOne({ where: { id } })
  }

  /**
   * Delete build record by ID
   */
  async deleteBuildRecord(id: number): Promise<boolean> {
    const record = await this.getBuildRecordById(id)

    if (!record) {
      return false
    }

    // Delete the file
    if (record.filePath && fs.existsSync(record.filePath)) {
      await fs.remove(record.filePath)
    }

    // Delete the record
    await this.buildRecordModel.delete(id)

    return true
  }
}

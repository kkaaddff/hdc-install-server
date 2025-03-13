import { UploadFileInfo } from '@midwayjs/busboy'
import { Controller, Fields, Files, Get, Inject, Post, Query } from '@midwayjs/decorator'
import { ApiOperation, ApiTags } from '@midwayjs/swagger'
import { BuildQueryDTO, BuildUploadDTO } from '../dto/buildDto'
import { BuildService } from '../service/buildService'

@ApiTags(['build'])
@Controller('/build')
export class BuildController {
  @Inject()
  buildService: BuildService

  /**
   * Upload build artifact
   */
  @ApiOperation({ summary: 'Upload build artifact' })
  @Post('/upload')
  async upload(@Files() files: UploadFileInfo[], @Fields() fields: Record<string, string>) {
    if (!files || files.length === 0) {
      return { success: false, message: 'No file uploaded' }
    }

    // Convert fields to BuildUploadDTO
    const buildInfo: BuildUploadDTO = {
      appName: fields.appName,
      buildType: fields.buildType,
      branch: fields.branch,
      buildTime: new Date(fields.buildTime),
      buildNumber: fields.buildNumber,
    }

    // Save the build record
    const record = await this.buildService.saveBuildRecord(buildInfo, files[0])

    return {
      success: true,
      message: 'Build artifact uploaded successfully',
      data: {
        id: record.id,
        fileName: record.fileName,
      },
    }
  }

  /**
   * Query build records
   */
  @ApiOperation({ summary: 'Query build records' })
  @Get('/query')
  async query(@Query() query: BuildQueryDTO) {
    const result = await this.buildService.queryBuildRecords(query)

    return {
      success: true,
      data: {
        records: result.records.map((record) => ({
          id: record.id,
          appName: record.appName,
          buildType: record.buildType,
          branch: record.branch,
          buildTime: record.buildTime,
          buildNumber: record.buildNumber,
          fileName: record.fileName,
          createdAt: record.createdAt,
          downloadUrl: `/files-cache/${record.fileName}`,
        })),
        total: result.total,
        page: query.page || 1,
        pageSize: query.pageSize || 10,
      },
    }
  }
}

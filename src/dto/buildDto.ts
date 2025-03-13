import { Rule, RuleType } from '@midwayjs/validate'
import { ApiProperty } from '@midwayjs/swagger'

export class BuildUploadDTO {
  @ApiProperty({ description: 'Application name' })
  @Rule(RuleType.string().required())
  appName: string

  @ApiProperty({ description: 'Build type (e.g., debug, release)' })
  @Rule(RuleType.string().required())
  buildType: string

  @ApiProperty({ description: 'Branch name' })
  @Rule(RuleType.string().required())
  branch: string

  @ApiProperty({ description: 'Build time' })
  @Rule(RuleType.date().required())
  buildTime: Date

  @ApiProperty({ description: 'Build number' })
  @Rule(RuleType.string().required())
  buildNumber: string
}

export class BuildQueryDTO {
  @ApiProperty({ description: 'Application name', required: false })
  @Rule(RuleType.string().optional())
  appName?: string

  @ApiProperty({ description: 'Build type (e.g., debug, release)', required: false })
  @Rule(RuleType.string().optional())
  buildType?: string

  @ApiProperty({ description: 'Branch name', required: false })
  @Rule(RuleType.string().optional())
  branch?: string

  @ApiProperty({ description: 'Page number', default: 1 })
  @Rule(RuleType.number().default(1).min(1))
  page?: number

  @ApiProperty({ description: 'Page size', default: 10 })
  @Rule(RuleType.number().default(10).min(1).max(100))
  pageSize?: number
}

import { Rule, RuleType } from '@midwayjs/validate'
import { InstallAppDTO } from '../interface'

export class InstallAppDTOValidate implements InstallAppDTO {
  @Rule(RuleType.string().required().uri())
  appUrl: string

  @Rule(RuleType.string().required().ip())
  deviceIp: string

  @Rule(RuleType.number().required().min(1).max(65535))
  devicePort: number
}

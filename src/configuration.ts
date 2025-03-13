import { Configuration, App } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import { join } from 'path'
import { DefaultErrorFilter } from './filter/default.filter'
import { NotFoundFilter } from './filter/notfound.filter'
import { ReportMiddleware } from './middleware/report.middleware'

@Configuration({
  imports: [koa, validate],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application

  async onReady() {
    // Add middleware
    this.app.useMiddleware([ReportMiddleware])

    // Add error filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter])
  }
}

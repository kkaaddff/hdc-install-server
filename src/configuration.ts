import { Configuration, App } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as staticFile from '@midwayjs/static-file'
import * as swagger from '@midwayjs/swagger'
import * as busboy from '@midwayjs/busboy'
import * as orm from '@midwayjs/typeorm'
import * as crossDomain from '@midwayjs/cross-domain'

import { join } from 'path'
import { DefaultErrorFilter } from './filter/default.filter'
import { NotFoundFilter } from './filter/notfound.filter'
import { ReportMiddleware } from './middleware/report.middleware'

@Configuration({
  imports: [koa, crossDomain, validate, staticFile, swagger, busboy, orm],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application

  async onReady() {
    // Add middleware
    this.app.useMiddleware([ReportMiddleware])
    this.app.useMiddleware(busboy.UploadMiddleware)
    // Add error filter
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter])
  }
}

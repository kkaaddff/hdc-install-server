import { Catch } from '@midwayjs/decorator'
import { httpError, MidwayHttpError } from '@midwayjs/core'
import { Context } from '@midwayjs/koa'

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    // Return a 404 response
    ctx.status = 404
    return {
      success: false,
      message: 'API not found',
    }
  }
}

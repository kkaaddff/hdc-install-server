import { Catch } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // Log the error
    ctx.logger.error(err)

    // Return a friendly error response
    return {
      success: false,
      message: err.message,
    }
  }
}

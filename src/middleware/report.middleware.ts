import { IMiddleware } from '@midwayjs/core'
import { Middleware } from '@midwayjs/decorator'
import { NextFunction, Context } from '@midwayjs/koa'

@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // Record request start time
      const startTime = Date.now()

      // Add request ID for tracking
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      ctx.requestId = requestId

      // Log the request
      ctx.logger.info(`[${requestId}] Request: ${ctx.method} ${ctx.path}`)

      try {
        // Process the request
        await next()

        // Calculate request duration
        const duration = Date.now() - startTime

        // Log the response
        ctx.logger.info(`[${requestId}] Response: ${ctx.status} (${duration}ms)`)
      } catch (error) {
        // Calculate request duration
        const duration = Date.now() - startTime

        // Log the error
        ctx.logger.error(`[${requestId}] Error: ${error.message} (${duration}ms)`)

        // Re-throw the error
        throw error
      }
    }
  }

  static getName(): string {
    return 'report'
  }
}

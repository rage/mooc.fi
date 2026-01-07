import { randomUUID } from "crypto"

import { NextFunction, Request, Response } from "express"
import { Logger } from "winston"

interface RequestTiming {
  startTime: number
  middlewareTimings: Record<string, number>
  correlationId: string
}

declare global {
  namespace Express {
    interface Request {
      timing?: RequestTiming
    }
  }
}

export const createRequestTimingMiddleware = (logger: Logger) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const correlationId = randomUUID()
    const startTime = Date.now()
    const middlewareTimings: Record<string, number> = {}

    req.timing = {
      startTime,
      middlewareTimings,
      correlationId,
    }

    const originalEnd = res.end.bind(res)
    res.end = function (chunk?: any, encoding?: any) {
      const totalDuration = Date.now() - startTime

      logger.info("Request completed", {
        correlationId,
        method: req.method,
        path: req.originalUrl || req.path,
        statusCode: res.statusCode,
        timings: {
          total: totalDuration,
          middleware: middlewareTimings,
        },
      })

      return originalEnd(chunk, encoding)
    }

    next()
  }
}

export const trackMiddlewareTiming = (
  req: Request,
  middlewareName: string,
  startTime: number,
): void => {
  if (req.timing) {
    const duration = Date.now() - startTime
    req.timing.middlewareTimings[middlewareName] = duration
  }
}

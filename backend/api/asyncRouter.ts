import axios from "axios"
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express"
import { Logger } from "winston"

const METHODS = ["get", "post", "put", "patch", "delete"] as const

/** Express 4 ignores rejected handler promises; turn them into a logged 500. */
const catchAsync =
  (handler: RequestHandler, logger: Logger): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => handler(req, res, next))
      .catch((error) => {
        // An axios error carries its request, Authorization included.
        logger.error(
          `Unhandled error in ${req.method} ${req.originalUrl}`,
          axios.isAxiosError(error)
            ? { status: error.response?.status, code: error.code }
            : { error },
        )
        if (res.headersSent) {
          res.end()
          return
        }
        res.status(500).json({ message: "Internal server error" })
      })
  }

/** Router whose route handlers are wrapped with {@link catchAsync}. */
export function asyncRouter(logger: Logger): Router {
  const router: any = Router()
  for (const method of METHODS) {
    const register = router[method].bind(router)
    router[method] = (path: string, ...handlers: RequestHandler[]) =>
      register(path, ...handlers.map((handler) => catchAsync(handler, logger)))
  }
  return router
}

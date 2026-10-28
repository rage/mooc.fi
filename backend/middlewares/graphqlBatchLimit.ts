import { NextFunction, Request, Response } from "express"

// The frontend's BatchHttpLink sends at most 10 (its default batchMax).
export const MAX_BATCHED_OPERATIONS = 20

/** Rejects batched GraphQL requests with more than `maxOperations` operations. */
export const limitGraphqlBatchSize =
  (maxOperations = MAX_BATCHED_OPERATIONS) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (Array.isArray(req.body) && req.body.length > maxOperations) {
      res.status(400).json({
        errors: [
          {
            message: `Batched requests are limited to ${maxOperations} operations`,
          },
        ],
      })
      return
    }
    next()
  }

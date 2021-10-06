import {
  NextFunction,
  Request,
  Response,
} from "express"
import { Profile } from "passport-saml"

export type HandlerCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => (err: any, user: Profile) => Promise<void>

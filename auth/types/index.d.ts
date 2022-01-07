declare module "unfuck-utf8-headers-middleware" {
  function shibbolethCharsetMiddleware(
    targetHeaders: string[],
  ): (req: Express.Request, res: Express.Response, next: Function) => void

  export = shibbolethCharsetMiddleware
}

declare namespace Express {
  interface Response {
    setMOOCCookies: (
      data: Record<string, any>,
      headers?: Record<string, any>,
    ) => this
  }
}

declare module "@voxpelli/passport-dummy" {
  import passport from "passport"

  export interface Options {
    allow?: boolean
  }

  export type VerifyFunction = (done: VerifiedCallback) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type VerifiedCallback = (err: any, user?: object) => void

  export class Strategy extends passport.Strategy {
    constructor(options: Options, verify: VerifyFunction)
    constructor(verify: VerifyFunction)
  }

  export const version: string
}

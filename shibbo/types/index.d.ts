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

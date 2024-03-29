declare module "unfuck-utf8-headers-middleware" {
  function shibbolethCharsetMiddleware(
    targetHeaders: string[],
  ): (
    req: Express.Request,
    res: Express.Response,
    next: (...args: any[]) => any,
  ) => void

  export = shibbolethCharsetMiddleware
}

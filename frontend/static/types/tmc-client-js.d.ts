declare module "tmc-client-js" {
  class TMCClient {
    constructor(clientId: string, clientSecret: string, oAuthSite?: string)

    authenticate({
      username,
      password,
    }: {
      username: string
      password: string
    }): Promise<any>

    unauthenticate(): any

    getUser(): any
  }

  export = TMCClient
}

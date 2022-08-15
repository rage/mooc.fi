namespace TMCClient {
  interface AuthenticateArgs {
    username: string
    password: string
  }

  interface AuthenticatedUser {
    username: string
    accessToken: string
  }
}
declare module "tmc-client-js" {
  class TMCClient {
    constructor(clientId: string, clientSecret: string, oAuthSite?: string)

    authenticate({
      username,
      password,
    }: TMCClient.AuthenticateArgs): Promise<TMCClient.AuthenticatedUser>

    unauthenticate(): TMCClient

    getUser(): TMCClient.AuthenticatedUser
  }

  export = TMCClient
}

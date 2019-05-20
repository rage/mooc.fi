export = index;

interface Credentials {
  username: string;
  password: string;
}

declare class index {
  constructor(clientId: string, clientSecret: string, ...args: any[]);
  clientId: any;
  clientSecret: any;
  api: any;
  authenticate(credentials: Credentials);
  getUser(): any;
  unauthenticate(): any;
}

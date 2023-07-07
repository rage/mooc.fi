declare module "next-statoscope" {
  import type { NextConfig } from "next"
  // eslint-disable-next-line import/no-extraneous-dependencies
  import type { Options } from "@statoscope/webpack-plugin"

  interface NextStatoscopeOptions extends Options {
    enabled?: boolean
  }

  const NextStatoscope: (
    options?: NextStatoscopeOptions,
  ) => (config?: NextConfig) => NextConfig

  export = NextStatoscope
}

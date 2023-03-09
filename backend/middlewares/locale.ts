import { plugin } from "nexus"

import { Context } from "../context"

export const localePlugin = () =>
  plugin({
    name: "LocalePlugin",
    onCreateFieldResolver(_config) {
      return async (root, args, ctx: Context, info, next) => {
        ctx.locale = ctx.req?.headers?.["accept-language"]

        return next(root, args, ctx, info)
      }
    },
  })

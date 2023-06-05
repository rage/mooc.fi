import { BaseContext } from "../context"
import { getCourseOrAliasKnex } from "../util/db-functions"
import {
  getOrganization,
  getUser,
  requireAdmin,
} from "../util/server-functions"

export type ApiContext = BaseContext

export abstract class Controller {
  protected getCourseKnex
  protected getUser
  protected getOrganization
  protected requireAdmin

  constructor(readonly ctx: ApiContext) {
    this.getCourseKnex = getCourseOrAliasKnex(ctx)
    this.getUser = getUser(ctx)
    this.getOrganization = getOrganization(ctx)
    this.requireAdmin = requireAdmin(ctx)
  }
}

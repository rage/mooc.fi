import { BaseContext } from "../context"
import { getCourseOrAlias, getCourseOrAliasKnex } from "../util/db-functions"
import {
  getOrganization,
  getUser,
  requireAdmin,
} from "../util/server-functions"

export type ApiContext = BaseContext

export abstract class Controller {
  protected getCourseKnex
  protected getCourse
  protected getUser
  protected getOrganization
  protected requireAdmin

  constructor(readonly ctx: ApiContext) {
    this.getCourse = getCourseOrAlias(ctx)
    this.getCourseKnex = getCourseOrAliasKnex(ctx)
    this.getUser = getUser(ctx)
    this.getOrganization = getOrganization(ctx)
    this.requireAdmin = requireAdmin(ctx)
  }
}

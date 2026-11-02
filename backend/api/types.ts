import { BaseContext } from "../context"
import { getCourseOrAliasKnex, getHandlerCourseKnex } from "../util"
import { findUser, getOrganization, getUser, requireAdmin } from "./utils"

export type ApiContext = BaseContext

export abstract class Controller {
  protected getCourseKnex
  protected getHandlerCourseKnex
  protected findUser
  protected getUser
  protected getOrganization
  protected requireAdmin

  constructor(readonly ctx: ApiContext) {
    this.getCourseKnex = getCourseOrAliasKnex(ctx)
    this.getHandlerCourseKnex = getHandlerCourseKnex(ctx)
    this.findUser = findUser(ctx)
    this.getUser = getUser(ctx)
    this.getOrganization = getOrganization(ctx)
    this.requireAdmin = requireAdmin(ctx)
  }
}

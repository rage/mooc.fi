import { BaseContext } from "/context"

export type TemplateContext = Pick<BaseContext, "prisma"> &
  Partial<Pick<BaseContext, "logger" | "knex">> & {
    test?: boolean // If true, don't send the email, just log it
  }

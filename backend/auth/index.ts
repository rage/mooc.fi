import type { PrismaClient } from "@prisma/client"
import { Knex } from "knex"
import { Router } from "express"

import { token, implicitToken } from "./token"
import { authorize } from "./authorize"
import { decision } from "./decision"
import { signUp } from "./signUp"
import { signOut } from "./signOut"
import { passwordReset } from "./passwordReset"
import { getClients, createClient, showClient, deleteClient } from "./clients"

import * as winston from "winston"

export interface ApiContext {
  prisma: PrismaClient
  knex: Knex
  logger: winston.Logger
}

export function authRouter(ctx: ApiContext) {
  return Router()
    .post("/signUp", signUp(ctx))
    .post("/signOut", signOut(ctx))
    .post("/passwordReset", passwordReset(ctx))
    .post("/token", token(ctx))
    .post("/implicit-token", implicitToken())
    .get("/authorize", authorize(ctx))
    .get("/decision/:code", decision(ctx))
    .get("/clients", getClients(ctx))
    .post("/clients", createClient(ctx))
    .get("/client/:id", showClient(ctx))
    .post("/deleteClient/:id", deleteClient(ctx))
}

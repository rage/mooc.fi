import type { PrismaClient } from "@prisma/client"
import type Knex from "knex"
import { Router } from "express"

import { token } from "./token"
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
    .post("/signUp", signUp())
    .post("/signOut", signOut(ctx))
    .post("/passwordReset", passwordReset())
    .post("/token", token())
    .get("/authorize", authorize(ctx))
    .get("/decision", decision(ctx))
    .get("/clients", getClients(ctx))
    .post("/clients", createClient(ctx))
    .get("/client", showClient(ctx))
    .post("/deleteClient", deleteClient(ctx))
}

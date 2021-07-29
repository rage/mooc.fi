import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"
import { Client } from "@prisma/client"

const crypto = require("crypto")

export function createClient(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({ error: auth })
    }
    if (!auth.admin) {
      return res.status(403).json({ error: "You do not have permission." })
    }

    let name = req.body.name
    let redirect_uri = req.body.redirect_uri

    let client_id = crypto.randomBytes(6).toString("hex")
    let client_secret = crypto.randomBytes(64).toString("hex")

    let client = (
      await ctx
        .knex("clients")
        .insert({
          name,
          client_id,
          client_secret,
          redirect_uri,
        })
        .returning("*")
    )?.[0]

    return res.status(200).json({
      success: true,
      client,
    })
  }
}

export function getClients(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({ error: auth })
    }
    if (!auth.admin) {
      return res.status(403).json({ error: "You do not have permission." })
    }

    let clients = await ctx.knex.select<any, Client[]>("*").from("clients")

    return res.status(200).json(clients)
  }
}

export function showClient(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({ error: auth })
    }
    if (!auth.admin) {
      return res.status(403).json({ error: "You do not have permission." })
    }

    const id = req.params.id

    let client = (
      await ctx.knex
        .select<any, Client[]>("*")
        .from("clients")
        .where("client_id", id)
    )?.[0]
    if (!client) {
      return res.status(404).json({
        error: "Client not found",
      })
    }

    return res.status(200).json(client)
  }
}

export function deleteClient(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({ error: auth })
    }
    if (!auth.admin) {
      return res.status(403).json({ error: "You do not have permission." })
    }

    const id = req.params.id

    let client = (
      await ctx.knex
        .select<any, Client[]>("*")
        .from("clients")
        .where("client_id", id)
    )?.[0]
    if (!client) {
      return res.status(404).json({
        error: "Client not found",
      })
    }

    await ctx.knex
      .select<any, Client[]>("*")
      .from("clients")
      .where("client_id", id)
      .del()

    return res.status(200).json({
      success: true,
    })
  }
}

export function regenerateClient(ctx: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization, ctx)
    if (auth.error) {
      return res.status(403).json({ error: auth })
    }
    if (!auth.admin) {
      return res.status(403).json({ error: "You do not have permission." })
    }

    const id = req.params.id

    let client = (
      await ctx.knex
        .select<any, Client[]>("*")
        .from("clients")
        .where("client_id", id)
    )?.[0]
    if (!client) {
      return res.status(404).json({
        error: "Client not found",
      })
    }

    let client_secret = crypto.randomBytes(64).toString("hex")

    let clientData = (
      await ctx.knex
        .select<any, Client[]>("*")
        .from("clients")
        .where("client_id", id)
        .update({ client_secret })
        .returning("*")
    )?.[0]

    return res.status(200).json({
      success: true,
      client: clientData,
    })
  }
}

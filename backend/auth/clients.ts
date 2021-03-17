import { ApiContext } from "."
import { requireAuth } from "../util/validateAuth"

const crypto = require("crypto")

export function createClient({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization)
    if (auth.error) { return res.status(403).json({ error: auth }) }

    let name = req.body.clientName
    let redirect_uri = req.body.clientRedirect

    let client_id = crypto.randomBytes(6).toString('hex')
    let client_secret = crypto.randomBytes(64).toString('hex')

    let client = (await knex("prisma2.clients")
      .insert({
        name,
        client_id,
        client_secret,
        redirect_uri
      }).returning("*")
    )?.[0]

    return res.status(200).json({
      success: true,
      client
    })
  }
}

export function getClients({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization)
    if (auth.error) { return res.status(403).json({ error: auth }) }
    if (!auth.administrator) { return res.status(403).json({ error: 'You do not have permission.' }) }

    let clients = await knex.select("*").from("prisma2.clients")

    return res.status(200).json(clients)
  }
}

export function showClient({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization)
    if (auth.error) { return res.status(403).json({ error: auth }) }
    if (!auth.administrator) { return res.status(403).json({ error: 'You do not have permission.' }) }

    const id = req.query.id

    let client = (await knex.select("*").from("prisma2.clients").where("client_id", id))?.[0]
    if (!client) {
      return res.status(404).json({
        error: "Client not found"
      })
    }

    return res.status(200).json(client)
  }
}

export function deleteClient({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization)
    if (auth.error) { return res.status(403).json({ error: auth }) }
    if (!auth.administrator) { return res.status(403).json({ error: 'You do not have permission.' }) }

    const id = req.query.id

    let client = (await knex.select("*").from("prisma2.clients").where("client_id", id))?.[0]
    if (!client) {
      return res.status(404).json({
        error: "Client not found"
      })
    }

    await knex.select("*").from("prisma2.clients").where("client_id", id).del()

    return res.status(200).json({
      success: true
    })
  }
}

export function regenerateClient({ knex }: ApiContext) {
  return async (req: any, res: any) => {
    let auth = await requireAuth(req.headers.authorization)
    if (auth.error) { return res.status(403).json({ error: auth }) }
    if (!auth.administrator) { return res.status(403).json({ error: 'You do not have permission.' }) }

    const id = req.query.id


    let client = (await knex.select("*").from("prisma2.clients").where("client_id", id))?.[0]
    if (!client) {
      return res.status(404).json({
        error: "Client not found"
      })
    }

    let client_secret = crypto.randomBytes(64).toString('hex')

    let clientData = (await knex.select("*").from("prisma2.clients").where("client_id", id).update({ client_secret }).returning("*"))?.[0]

    return res.status(200).json({
      success: true,
      client: clientData
    })
  }
}



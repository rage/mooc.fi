import axios from "axios"
import Cookies from "universal-cookie"
import { getAccessToken } from "../lib/authentication"

const cookies = new Cookies()
const domain = process.env.NODE_ENV === "production" ? "mooc.fi" : "localhost"
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mooc.fi"
    : "http://localhost:4000"

const token = cookies.get("token")
const tmcToken = cookies.get("tmcToken")

export const getAuthorization = async (code: string | string[]) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/auth/authorize/${code}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

export const decision = async (code: string | string[]) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/auth/decision/${code}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  })
    .then((response) => response.data)
    .then(
      (json) =>
        `${json.redirectUri}?code=${code}&tmc=${
          tmcToken || cookies.get("tmcToken")
        }`,
    )
    .catch((error) => error)
}

export const signIn = async (email: string, password: string) => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/auth/token`,
    data: {
      email,
      password,
      grant_type: "password",
    },
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.data)
    .then((json) => {
      cookies.set("token", JSON.stringify(json.access_token), {
        domain: domain,
      })
      cookies.set("tmcToken", JSON.stringify(json.tmc_token), {
        domain: domain,
      })
      return json.access_token
    })
    .catch((error) => error)
}

export const getClients = async () => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/auth/clients`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken(undefined)}`,
    },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

export const createClient = async (
  clientName: string,
  clientRedirect: string,
) => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/auth/clients`,
    data: {
      name: clientName,
      redirect_uri: clientRedirect,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken(undefined)}`,
    },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

export const showClient = async (id: string | string[]) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/auth/client/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken(undefined)}`,
    },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

export const updateClient = async (id: string | string[]) => {
  return await axios({
    method: "PUT",
    url: `${BASE_URL}/auth/client/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken(undefined)}`,
    },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

export const regenerateClient = async (id: string | string[]) => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/auth/regenerateSecret/${id}`,
    data: {},
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken(undefined)}`,
    },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

export const deleteClient = async (id: string | string[]) => {
  return await axios({
    method: "POST",
    url: `${BASE_URL}/auth/deleteClient/${id}`,
    data: {},
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken(undefined)}`,
    },
  })
    .then((response) => response.data)
    .then((json) => json)
    .catch((error) => error)
}

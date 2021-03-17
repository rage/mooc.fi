import axios from "axios"
import Cookies from "universal-cookie"

/*
const axios = require("axios")
const Cookies = require("universal-cookie")
*/

const BASE_URL = 'http://localhost:4000'

interface ExtraFields {
    namespace: string,
    data: any
}

interface UserFields {
    organizational_id?: string,
    first_name?: string,
    last_name?: string
}

export const createUser = async (email: string, password: string, confirmPassword: string, provider: string = "native", extra_fields: ExtraFields, user_fields: UserFields, domain: string = "localhost") => {
    const cookies = new Cookies()

    return await axios({
        method: 'POST',
        url: `${BASE_URL}/auth/signUp`,
        data: {
            email,
            password,
            confirmPassword,
            provider,
            extra_fields,
            user_fields
        },
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.data)
        .then(json => {
            cookies.set("access_token", JSON.stringify(json.auth.access_token), { domain: domain })
            cookies.set("tmc_token", JSON.stringify(json.auth.tmc), { domain: domain })

            return json
        })
        .then(error => error)
}

interface Data {
    client_id: string,
    grant_type: string,
    response_type: string,
    domain: string,
    email?: string,
    password?: string,
    code?: string,
    tmc?: string,
}

export const getToken = async (data: Data) => {
    const cookies = new Cookies()

    return await axios({
        method: 'POST',
        url: `${BASE_URL}/auth/token`,
        data: data,
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.data)
        .then(json => {
            if (json.targetUri) {
                window.location.replace(json.targetUri)
            } else {
                cookies.set("access_token", JSON.stringify(json.access_token), { domain: data.domain })
                cookies.set("tmc_token", JSON.stringify(data.tmc), { domain: data.domain })

                return { access_token: json.access_token, tmc_token: data.tmc || json.tmc_token }
            }
        })
}

export const removeToken = async () => {
    const cookies = new Cookies()

    return await axios({
        method: 'POST',
        url: `${BASE_URL}/auth/signOut`,
        data: {},
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken().access_token}`
        }
    })
        .then(response => response.data)
        .then(json => {
            cookies.remove("access_token")
            cookies.remove("tmc_token")
            return json
        })
        .catch(error => {
            return error.response.data
        })
}


export const getAccessToken = () => {
    const cookies = new Cookies()
    let access_token = cookies.get("access_token")

    return access_token
}

export const getTMCToken = () => {
    const cookies = new Cookies()
    let tmc_token = cookies.get("tmc_token")

    return tmc_token
}
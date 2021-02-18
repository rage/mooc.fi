const fs = require('fs')
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY)
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY)
const jwt = require('jsonwebtoken')

export function validateEmail(
    value: string,
): value is string {
    const mailRegex = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    return mailRegex.test(value)
}

export function validatePassword(
    value: string,
): value is string {
    const passwordRegex = /^[A-Za-z]\w{6,64}$/

    return passwordRegex.test(value)
}

export function getUid(
    length: Number
) {
    let uid = ''
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charsLength = chars.length

    for (let i = 0; i < length; ++i) {
        uid += chars[getRandomInt(0, charsLength - 1)]
    }

    return uid
}

function getRandomInt(min: Number, max: Number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function requireAuth(auth) {
    let token = auth.replace("Bearer ", "")
    if(!token) {
      return {
        message: 'Missing token'
      }
    }
    
    return jwt.verify(token, publicKey, (err, data) => {
      if(err) {
        return { error: err }
      }

      return { ...data }
    })
}
const argon2 = require("argon2")

export async function argon2Hash(value: string) {
  return await argon2.hash(value, {
    type: argon2.argon2id,
    timeCost: 4,
    memoryCost: 15360,
    hashLength: 64,
  })
}

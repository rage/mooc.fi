import { randomInt, timingSafeEqual } from "crypto"

/** Code submissions a join confirmation accepts before it is treated as expired. */
export const MAX_ACTIVATION_ATTEMPTS = 5

/** Generates a random 6-digit organization-join activation code. */
export const generateActivationCode = (): string =>
  randomInt(0, 1_000_000).toString().padStart(6, "0")

/**
 * Compares a submitted activation code with the stored one in constant time.
 * Returns false when no code is stored.
 */
export const isActivationCodeMatch = (
  storedCode: string | null | undefined,
  submittedCode: string,
): boolean => {
  if (!storedCode) {
    return false
  }
  const stored = Buffer.from(storedCode)
  const submitted = Buffer.from(submittedCode)

  return (
    stored.length === submitted.length && timingSafeEqual(stored, submitted)
  )
}

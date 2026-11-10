import { randomInt } from "crypto"

/** Wrong activation codes a membership may submit, across all its join confirmations, before it is locked. */
export const MAX_ACTIVATION_ATTEMPTS = 5

/** Generates a random 6-digit organization-join activation code. */
export const generateActivationCode = (): string =>
  randomInt(0, 1_000_000).toString().padStart(6, "0")

import { createHash, timingSafeEqual } from "crypto"

const sha256 = (value: string) => createHash("sha256").update(value).digest()

/**
 * Compares a submitted secret with the stored one in constant time, so that
 * neither the contents nor the length of the stored secret leak through timing.
 * Returns false when no secret is stored.
 */
export const isSecretMatch = (
  stored: string | null | undefined,
  submitted: string,
): boolean => !!stored && timingSafeEqual(sha256(stored), sha256(submitted))

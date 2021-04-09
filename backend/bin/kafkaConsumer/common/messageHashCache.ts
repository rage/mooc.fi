// For preventing handling same messages multiple times
// Stores hashes of latest CACHE_SIZE messages in an array

import { createHash } from "crypto"

const CACHE_SIZE = 1000
const messageHashes: (string | undefined)[] = Array(CACHE_SIZE)
// Position where next cached hash should be written in the array.
let cursor = 0

export function handledRecently(message: string): boolean {
  const hash = hashMessage(message)
  const previouslySeenHash = messageHashes.find((o) => o === hash)
  if (previouslySeenHash) {
    return true
  }
  return false
}

export function setHandledRecently(message: string): void {
  messageHashes[cursor] = hashMessage(message)
  cursor = cursor + 1
  if (cursor >= CACHE_SIZE) {
    cursor = 0
  }
}

function hashMessage(message: string): string {
  return createHash("sha256").update(message, "utf8").digest().toString("utf8")
}

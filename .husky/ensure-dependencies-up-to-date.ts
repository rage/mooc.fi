import { execFileSync, spawnSync } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const projectRoot = path.resolve(import.meta.dirname, "..")
const savedHashPath = path.join(projectRoot, ".husky/_/saved-pnpm-lock-hash")

const lockfileHash = execFileSync(
  "git",
  ["log", "-n", "1", "--pretty=format:%H", "--", "pnpm-lock.yaml"],
  { cwd: projectRoot, encoding: "utf-8" },
).trim()

let savedHash: string | null = null
try {
  savedHash = readFileSync(savedHashPath, "utf-8")
} catch {
  // not written yet
}

if (lockfileHash !== savedHash) {
  console.log("pnpm-lock.yaml changed; running pnpm install --frozen-lockfile")
  const result = spawnSync("pnpm", ["install", "--frozen-lockfile"], {
    cwd: projectRoot,
    stdio: "inherit",
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
  mkdirSync(path.dirname(savedHashPath), { recursive: true })
  writeFileSync(savedHashPath, lockfileHash)
}

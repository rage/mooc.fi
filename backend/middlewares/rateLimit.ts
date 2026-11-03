import { isIPv4, isIPv6 } from "net"

import { NextFunction, Request, Response } from "express"

interface Window {
  startedAt: number
  count: number
}

/**
 * Counts hits per key in fixed windows of `windowMs`, allowing `limit` in each. The returned
 * function counts a hit and answers the seconds to wait when it is over the limit, otherwise null.
 *
 * Counts in this process only, so every replica allows `limit` on its own.
 */
export const createRateLimiter = ({
  limit,
  windowMs,
}: {
  limit: number
  windowMs: number
}) => {
  const windows = new Map<string, Window>()
  let lastSweepAt = Date.now()

  const forgetEndedWindows = (now: number) => {
    for (const [key, window] of windows) {
      if (now - window.startedAt >= windowMs) {
        windows.delete(key)
      }
    }
    lastSweepAt = now
  }

  return (key: string): number | null => {
    const now = Date.now()
    let window = windows.get(key)

    if (!window || now - window.startedAt >= windowMs) {
      if (now - lastSweepAt >= windowMs) {
        forgetEndedWindows(now)
      }
      window = { startedAt: now, count: 0 }
      windows.set(key, window)
    }

    window.count += 1
    return window.count > limit
      ? Math.ceil((window.startedAt + windowMs - now) / 1000)
      : null
  }
}

/** Answers 429 `{ type: "rate_limited" }` with Retry-After. */
export const refuseRateLimited = (res: Response, retryAfterSeconds: number) =>
  res
    .set("Retry-After", String(retryAfterSeconds))
    .status(429)
    .json({ type: "rate_limited" })

const ipv6Groups = (address: string) => {
  const groupsOf = (part: string) =>
    part === ""
      ? []
      : part
          .split(":")
          // An embedded IPv4 tail fills the last two groups.
          .flatMap((group) => (group.includes(".") ? ["0", "0"] : [group]))
  const [head, tail] = address.split("::")
  if (tail === undefined) {
    return groupsOf(head)
  }
  const headGroups = groupsOf(head)
  const tailGroups = groupsOf(tail)
  return [
    ...headGroups,
    ...Array<string>(8 - headGroups.length - tailGroups.length).fill("0"),
    ...tailGroups,
  ]
}

/**
 * The key a client IP is counted under: IPv4 as is, IPv6 by its /64, which one subscriber
 * usually holds whole.
 */
export const rateLimitKeyForIp = (ip: string) => {
  const address = ip.replace(/%.*$/, "")
  const mappedIpv4 = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address)?.[1]
  if (mappedIpv4 && isIPv4(mappedIpv4)) {
    return mappedIpv4
  }
  if (!isIPv6(address)) {
    return address
  }
  const prefix = ipv6Groups(address)
    .slice(0, 4)
    .map((group) => parseInt(group, 16).toString(16))
    .join(":")
  return `${prefix}::/64`
}

/**
 * Caps requests per client IP (IPv6 per /64) to `limit` in each fixed window of `windowMs`; over
 * it, answers 429 `{ type: "rate_limited" }` with Retry-After.
 *
 * One limiter shared by several routes counts them together.
 */
export const limitRequestsPerIp = (options: {
  limit: number
  windowMs: number
}) => {
  const hit = createRateLimiter(options)

  return (req: Request, res: Response, next: NextFunction) => {
    const retryAfterSeconds = hit(rateLimitKeyForIp(req.ip ?? ""))
    if (retryAfterSeconds !== null) {
      refuseRateLimited(res, retryAfterSeconds)
      return
    }
    next()
  }
}

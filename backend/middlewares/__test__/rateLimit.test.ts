import { rateLimitKeyForIp } from "../rateLimit"

describe("rateLimitKeyForIp", () => {
  it.each([
    ["203.0.113.7", "203.0.113.7"],
    ["::ffff:203.0.113.7", "203.0.113.7"],
    ["2001:db8:1:2::1", "2001:db8:1:2::/64"],
    ["2001:0db8:0001:0002:aaaa:bbbb:cccc:dddd", "2001:db8:1:2::/64"],
    ["2001:db8::1", "2001:db8:0:0::/64"],
    ["::1", "0:0:0:0::/64"],
    ["fe80::1%eth0", "fe80:0:0:0::/64"],
    ["2001:db8:1:2::203.0.113.7", "2001:db8:1:2::/64"],
  ])("keys %s as %s", (ip, key) => {
    expect(rateLimitKeyForIp(ip)).toBe(key)
  })
})

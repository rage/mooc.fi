// Autofixers only; the failing gates (oxlint, oxfmt --check) run in CI.
const config = {
  "*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": [
    "oxlint --fix --no-error-on-unmatched-pattern",
    "oxfmt --no-error-on-unmatched-pattern",
  ],
  // oxfmt skips types it can't format; negated so JS/TS isn't formatted concurrently with the rule above.
  "!(*.{js,jsx,mjs,cjs,ts,tsx,mts,cts})":
    "oxfmt --no-error-on-unmatched-pattern",
}

export default config

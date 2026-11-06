import nock from "nock"

// Every test file loads its own nock, which patches the worker-wide `http`/`net` modules again.
// Unrestored, the patches stack up across files and multiply Postgres connections.
afterAll(() => {
  nock.restore()
})

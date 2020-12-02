export const info = jest.fn()
export const warn = jest.fn()
export const error = jest.fn()

const logger = jest.fn().mockImplementation(() => ({
  info,
  warn,
  error,
}))

export default logger

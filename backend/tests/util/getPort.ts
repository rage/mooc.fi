let _getPort: {
  (options?: any): Promise<number>,
  makeRange(from: number, to: number): Iterable<number>
}

const _getPortInstance = async () => {
  if (!_getPort) {
    _getPort = require("get-port")
  }

  return _getPort
}

export default _getPortInstance()

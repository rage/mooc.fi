"use strict"
exports.__esModule = true
var client_1 = require("@prisma/client")
var _prisma
var prismaClient = function () {
  if (!_prisma) {
    _prisma = new client_1.PrismaClient()
  }
  return _prisma
}
exports["default"] = prismaClient
//# sourceMappingURL=prisma.js.map

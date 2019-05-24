import { ForbiddenError } from "apollo-server-core";
import { Prisma } from "../../generated/prisma-client";

const addService = async (_, { url }, ctx) => {
    const prisma : Prisma = ctx.prisma
    if(!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied")
    }
    return await prisma.createService({url: url})
}

export default addService
import { Prisma } from "../../generated/prisma-client";

const services = async (_, args, ctx)  => {
    const prisma : Prisma = ctx.prisma
    return prisma.services()
}

export default services
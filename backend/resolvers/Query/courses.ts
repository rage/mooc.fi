import { ForbiddenError } from "apollo-server-core";

const courses = async (_, args, ctx) => {
    if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied");
    }
    return ctx.prisma.courses()
}

export default courses
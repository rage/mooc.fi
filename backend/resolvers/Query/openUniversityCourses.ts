import { ForbiddenError } from "apollo-server-core";

const openUniversityCourses = async (_, args, ctx) => {
    if (!ctx.user.administrator) {
        throw new ForbiddenError("Access Denied");
    }
    return ctx.prisma.openUniversityCourses()
}

export default openUniversityCourses
import { ForbiddenError } from "apollo-server-core";
import { Prisma, Course } from "../../generated/prisma-client";

const addCourse = async (_, { name, slug }, ctx) => {
    if (!ctx.user.administrator) {
      throw new ForbiddenError("Access Denied");
    }
    const prisma: Prisma = ctx.prisma
    const newCourse: Course = await prisma.createCourse({
      name: name,
      slug: slug
    })
    return newCourse
  }

  export default addCourse
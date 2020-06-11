// import { idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.courseVariant()
    t.crud.courseVariants({
      filtering: {
        course: true,
      },
    })
    /*t.field("courseVariant", {
      type: "course_variant",
      args: {
        id: idArg(),
      },
      nullable: true,
      resolve: (_, args, ctx) => {
        const { id } = args

        return ctx.db.course_variant.findOne({ where: { id } })
      },
    })

    t.list.field("courseVariants", {
      type: "course_variant",
      args: {
        course_id: idArg(),
      },
      resolve: (_, args, ctx) => {
        const { course_id } = args

        return ctx.db.course.findOne({ where: { id: course_id } }).course_variant()
      },
    })*/
  },
})

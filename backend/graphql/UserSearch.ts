import { enumType, objectType } from "nexus"

export const UserSearchFieldEnum = enumType({
  name: "UserSearchField",
  members: [
    "email",
    "first_name",
    "last_name",
    "full_name",
    "username",
    "upstream_id",
    // "id",
    "student_number",
    "real_student_number",
  ],
})

export const UserSearch = objectType({
  name: "UserSearch",
  definition(t) {
    t.string("search")
    t.nonNull.field("field", {
      type: "UserSearchField",
      description: "current search condition field(s)",
    })
    t.string("fieldValue", {
      description: "values used for current search condition field(s)",
    })
    t.nonNull.list.nonNull.field("matches", { type: "User" })
    t.nonNull.list.nonNull.string("allMatchIds")
    t.nonNull.int("count", { description: "total count of matches so far" })
    t.nonNull.int("fieldIndex", {
      description: "index of current search field",
    })
    t.nonNull.int("fieldCount", {
      description: "total number of search fields",
    })
    t.nonNull.int("fieldResultCount", {
      description: "total number of matches for current search field",
    })
    t.nonNull.int("fieldUniqueResultCount", {
      description: "total number of unique matches for current search field",
    })
    t.nonNull.boolean("finished")
  },
})

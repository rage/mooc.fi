import { Context } from "/context"

import { Course, Prisma } from "@prisma/client"

import { isNotNullOrUndefined } from "./isNullOrUndefined"

export const getIds = (arr: any[], idField: string = "id") =>
  (arr || []).map((t) => t[idField])
const filterNotIncluded = (
  arr1: any[],
  arr2: any[],
  idField: string = "id",
  mapToId = true,
) => {
  const ids1 = getIds(arr1, idField)
  const ids2 = getIds(arr2, idField)

  const filtered = ids1.filter((id) => !ids2.includes(id))

  if (mapToId) {
    return filtered.map((id) => ({ [idField]: id }))
  }

  return filtered
}

type IdKeyType = "id" | `${string}_id`

interface ICreateMutation<
  T extends Record<string, any>,
  IdKey extends IdKeyType,
> {
  data?: T[] | null
  field: keyof Prisma.Prisma__CourseClient<Course>
  id?: IdKey
}

type CreateMutationReturn<
  T extends Record<string, any>,
  IdKey extends IdKeyType,
> =
  | {
      create?: Array<T & { [key in IdKey]: undefined }>
      updateMany?: Array<{
        where: { [key in IdKey]: string }
        data: T & { [key in IdKey]: string }
      }>
      deleteMany?: Array<T & { [key in IdKey]: string }>
    }
  | undefined

// - given the data (a course field like course_translations) and the field name, returns the Prisma mutations to create, update, or delete data
const createCourseMutationFunction =
  (ctx: Context, slug: string) =>
  async <T extends Record<string, any>, IdKey extends IdKeyType>({
    data,
    field,
    id = "id" as IdKey,
  }: ICreateMutation<T, IdKey>): Promise<CreateMutationReturn<T, IdKey>> => {
    if (!isNotNullOrUndefined(data)) {
      return undefined
    }

    let existing: T[] | undefined

    try {
      // @ts-ignore: can't be arsed to do the typing, works
      existing = await ctx.prisma.course
        .findUnique({ where: { slug } })
        [field]()
    } catch (e) {
      throw new Error(
        `error creating mutation ${String(field)} for course ${slug}: ${e}`,
      )
    }

    const newOnes = data
      .filter(hasNotId(id)) // (t) => !t.id
      .map((t) => ({ ...t, [id]: undefined }))
    const updated = data
      .filter(isNotNullOrUndefined)
      .filter(hasId(id)) // (t) => !!t.id)
      .map((t) => {
        return {
          where: { [id]: t[id] as string } as { [key in IdKey]: string },
          data: t!, //{ ...t, id: undefined },
        }
      })
    const removed = filterNotIncluded(existing!, data, id)

    return {
      create: newOnes.length ? newOnes : undefined,
      updateMany: updated.length ? updated : undefined,
      deleteMany: removed.length ? removed : undefined,
    }
  }

type MutableField =
  | keyof Prisma.Prisma__CourseClient<Course>
  | { name: keyof Prisma.Prisma__CourseClient<Course>; id: IdKeyType }

const isMutableFieldWithId = (
  field: MutableField,
): field is {
  name: keyof Prisma.Prisma__CourseClient<Course>
  id: IdKeyType
} => typeof field === "object" && "name" in field && "id" in field

// - fields are course related fields, which can be either given in string form or as an object with name and id, if the object id is something else than "id"
// - returns mutations to create, update, or delete data
export const createCourseMutations =
  (ctx: Context, slug: string) =>
  (fields: Array<MutableField>) =>
  async (
    data: Partial<Record<keyof Prisma.Prisma__CourseClient<Course>, any>>,
  ) => {
    const mutations = {} as Record<
      keyof Prisma.Prisma__CourseClient<Course>,
      CreateMutationReturn<any, any>
    >

    for (const field of fields) {
      if (isMutableFieldWithId(field)) {
        mutations[field.name] = await createCourseMutationFunction(
          ctx,
          slug,
        )({ data: data[field.name], field: field.name, id: field.id })
      } else {
        mutations[field] = await createCourseMutationFunction(
          ctx,
          slug,
        )({ data: data[field], field })
      }
    }

    return mutations
  }

const hasId =
  <T extends Record<string, any>, IdKey extends IdKeyType>(id: IdKey) =>
  (data: T): data is T & { [key in IdKey]: string | null } =>
    Boolean(data?.[id])
const hasNotId =
  <T extends Record<string, any>, IdKey extends IdKeyType>(id: IdKey) =>
  (data: T) =>
    !hasId(id)(data)

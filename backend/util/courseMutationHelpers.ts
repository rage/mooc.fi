import { Course, Prisma } from "@prisma/client"

import { isNotNullOrUndefined } from "./isNullOrUndefined"
import { Context } from "/context"

export const getIds = (arr: any[], idField = "id") =>
  (arr || []).map((t) => t[idField])
const filterNotIncluded = (
  arr1: any[],
  arr2: any[],
  idField = "id",
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

type PartialAndNullable<T> = { [P in keyof T]?: T[P] | null }

type InferSelectType<Relation extends keyof Prisma.Prisma__CourseClient<any>> =
  Prisma.Prisma__CourseClient<any>[Relation] extends (
    args?: Prisma.Subset<infer T, infer Args> | undefined,
  ) => any
    ? Prisma.Prisma__CourseClient<any>[Relation] extends (
        args?: Prisma.Subset<T, Args> | undefined,
      ) => Prisma.CheckSelect<T, infer S, any>
      ? S
      : never
    : never

// limit to relations of array type
type CourseRelation = {
  [Key in keyof Prisma.Prisma__CourseClient<any>]: InferSelectType<Key> extends infer S
    ? S extends Promise<Array<any>>
      ? Key
      : never
    : never
}[keyof Prisma.Prisma__CourseClient<any>]

// get relation type from relation name
type CourseRelationType<Relation extends CourseRelation = CourseRelation> =
  InferSelectType<Relation> extends infer S
    ? S extends Promise<infer Type>
      ? Type extends Array<infer ArrayType>
        ? NonNullable<ArrayType>
        : NonNullable<Type>
      : never
    : never

// get any id fields from relation name through relation type
// TODO: actually should be getting composite keys as well, those should be accessible through CourseUpdateInput[Relation] -> where
type CourseRelationKey<Relation extends CourseRelation> = {
  [Key in keyof CourseRelationType<Relation>]: Key extends IdKeyType
    ? Key
    : never
}[keyof CourseRelationType<Relation>]

type CreateMutationReturn<Relation extends CourseRelation = CourseRelation> =
  Prisma.CourseUpdateInput[Relation]

type CreateMutationParams<
  Relation extends CourseRelation = CourseRelation,
  RelationInstance extends CourseRelationType<Relation> = CourseRelationType<Relation>,
  IdKey extends CourseRelationKey<Relation> = CourseRelationKey<Relation>,
> = IdKey extends IdKeyType
  ? {
      data?: RelationInstance[] | null
      relation: Relation
      id?: IdKey
    }
  : never

type CourseMutationFunction<
  Relation extends CourseRelation,
  IdKey extends CourseRelationKey<Relation> = CourseRelationKey<Relation>,
> = (
  params: CreateMutationParams<Relation, CourseRelationType<Relation>, IdKey>,
) => Promise<CreateMutationReturn<Relation>>

// given the data (a course field like course_translations) and the field name,
// returns the Prisma mutations to create, update, or delete data
const createCourseMutationFunction =
  <
    Relation extends CourseRelation = CourseRelation,
    IdKey extends CourseRelationKey<Relation> = CourseRelationKey<Relation>,
  >(
    ctx: Context,
    slug: string,
  ): CourseMutationFunction<Relation> =>
  async ({ data, relation, id = "id" as IdKey }) => {
    if (!isNotNullOrUndefined(data)) {
      return undefined
    }

    let existing

    try {
      // @ts-ignore: can't be arsed to do the typing, works
      existing = await ctx.prisma.course
        .findUnique({ where: { slug } })
        [relation]()
    } catch (e) {
      throw new Error(
        `error creating mutation ${String(relation)} for course ${slug}: ${e}`,
      )
    }

    const hasIdFilter = hasId<Relation>(id as IdKey)
    const hasNotIdFilter = hasNotId<Relation>(id as IdKey)

    const mutation = {} as NonNullable<CreateMutationReturn<Relation>>
    mutation.create = data
      .filter(hasNotIdFilter)
      .map((t) => Object.assign({}, t, { [id]: undefined }))
    mutation.updateMany = data
      .filter(isNotNullOrUndefined)
      .filter(hasIdFilter)
      .map((t) => {
        return {
          where: { [id]: t[id as IdKey] },
          data: t,
        }
      })
    mutation.deleteMany = filterNotIncluded(existing ?? [], data, id)

    return mutation
  }

type MutableRelationWithId<Relation = CourseRelation> =
  Relation extends CourseRelation
    ? { name: Relation; id: CourseRelationKey<Relation> & string }
    : never
type MutableRelation<Relation extends CourseRelation = CourseRelation> =
  | Relation
  | MutableRelationWithId<Relation>

type CourseMutationsReturn<Relations extends readonly CourseRelation[]> = {
  [Key in Relations[number]]: CreateMutationReturn<Key> | undefined
}

const isMutableRelationWithId = <
  Relation extends CourseRelation = CourseRelation,
>(
  relation: MutableRelation<Relation>,
): relation is MutableRelationWithId<Relation> =>
  typeof relation === "object" && "name" in relation && "id" in relation

type CourseRelationsFromMutableRelations<
  MutableRelations extends readonly MutableRelation[],
> = {
  [K in keyof MutableRelations]: MutableRelations[K] extends MutableRelationWithId<
    infer Relation
  >
    ? Relation
    : MutableRelations[K]
}[number] &
  readonly CourseRelation[]

type DataType = PartialAndNullable<Course> & {
  [Key in CourseRelation]?: Array<
    PartialAndNullable<CourseRelationType<Key>>
  > | null
}

// - fields are course related fields, which can be either given in string form or as an object with name and id, if the object id is something else than "id"
// - returns mutations to create, update, or delete data
export const createCourseMutations =
  (ctx: Context, slug: string) =>
  <
    MutableRelations extends readonly MutableRelation[] = readonly MutableRelation[],
    Relations extends CourseRelationsFromMutableRelations<MutableRelations> = CourseRelationsFromMutableRelations<MutableRelations>,
  >(
    relations: MutableRelations,
  ) =>
  async (data: DataType) => {
    const mutations = {} as CourseMutationsReturn<Relations>
    const courseMutationFunction = createCourseMutationFunction<
      Relations[number]
    >(ctx, slug)

    for (const relation of relations) {
      if (isMutableRelationWithId(relation)) {
        mutations[relation.name as Relations[number]] =
          await courseMutationFunction({
            data: data[relation.name],
            relation: relation.name,
            id: relation.id,
          } as CreateMutationParams<Relations[number]>)
      } else {
        mutations[relation as Relations[number]] = await courseMutationFunction(
          { data: data[relation], relation } as CreateMutationParams<
            Relations[number]
          >,
        )
      }
    }

    return mutations
  }

export const connectOrDisconnect = <T>(
  receivedArg: string | null | undefined,
  existing: T | null,
) => {
  if (receivedArg) {
    return { connect: { id: receivedArg } }
  }
  if (existing) {
    return { disconnect: true }
  }

  return undefined
}

const hasId =
  <
    Relation extends CourseRelation = CourseRelation,
    IdKey extends CourseRelationKey<Relation> = CourseRelationKey<Relation>,
  >(
    id: IdKey,
  ) =>
  <
    RelationInstance extends CourseRelationType<Relation> = CourseRelationType<Relation>,
  >(
    data: any,
  ): data is RelationInstance & { [key in IdKey]: string | null } =>
    Boolean(data?.[id])

const hasNotId =
  <
    Relation extends CourseRelation = CourseRelation,
    IdKey extends CourseRelationKey<Relation> = CourseRelationKey<Relation>,
  >(
    id: IdKey,
  ) =>
  <
    RelationInstance extends CourseRelationType<Relation> = CourseRelationType<Relation>,
  >(
    data: any,
  ): data is RelationInstance & { [key in IdKey]: undefined } =>
    !Boolean(data?.[id])

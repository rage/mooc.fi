import { Sql } from "@prisma/client/runtime"
import {
  arg,
  enumType,
  intArg,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus"
import { redisify } from "../services/redis"
import { Context } from "../context"
import { UserInputError } from "apollo-server-express"

export const CourseStatisticsValue = objectType({
  name: "CourseStatisticsValue",
  definition(t) {
    t.int("value")
    t.nullable.field("date", { type: "DateTime" })
    t.nullable.int("unit_value")
  },
})

export const CourseStatisticsEntry = objectType({
  name: "CourseStatisticsEntry",
  definition(t) {
    t.field("updated_at", { type: "DateTime" })
    t.nullable.field("unit", { type: "TimeGroupUnit" })
    t.nonNull.list.nonNull.field("data", { type: "CourseStatisticsValue" })
  },
})

export const IntervalUnit = enumType({
  name: "IntervalUnit",
  members: ["day", "month", "week", "year"],
})

type IntervalUnit = "day" | "month" | "week" | "year"

export const TimeGroupUnit = enumType({
  name: "TimeGroupUnit",
  members: [
    "century",
    "day",
    "decade",
    "dow",
    "doy",
    "epoch",
    "hour",
    "isodow",
    "isoyear",
    "microseconds",
    "millennium",
    "milliseconds",
    "minute",
    "month",
    "quarter",
    "second",
    "timezone",
    "timezone_hour",
    "timezone_minute",
    "week",
    "year",
  ],
})

type TimeGroupUnit =
  | "century"
  | "day"
  | "decade"
  | "dow"
  | "doy"
  | "epoch"
  | "hour"
  | "isodow"
  | "isoyear"
  | "microseconds"
  | "millennium"
  | "milliseconds"
  | "minute"
  | "month"
  | "quarter"
  | "second"
  | "timezone"
  | "timezone_hour"
  | "timezone_minute"
  | "week"
  | "year"
interface CourseStatisticsValue {
  value?: number
  date?: number
  unit?: TimeGroupUnit
  unitValue?: number
}

interface CreateStatisticQuery {
  path: string
  ctx: Context
  query: string | TemplateStringsArray | Sql
  values?: any[]
  expireTime?: number
  unit?: TimeGroupUnit
  keyFn?: (...values: any[]) => string
  disableCaching?: boolean
}

/*const permittedUnits = "day|week|month|year"
const intervalRegex = new RegExp(
  `^(\\d\\s+(${permittedUnits})$|(\\d{2,}\\s+(${permittedUnits})s$))`,
  "i",
)
const validateInterval = (interval: string | null) => {
  if (!interval || !intervalRegex.test(interval.trim())) {
    throw new UserInputError(`invalid interval: ${interval}`)
  }
}*/

const getIntervalString = (number: number, unit: IntervalUnit) => {
  return `${number} ${unit}${number > 1 ? "s" : ""}`
}

const createStatisticsQuery = async ({
  path,
  ctx,
  query,
  values = [],
  expireTime = 1,
  unit,
  keyFn = (..._values) => _values.map((v) => v.toString()).join("-"),
  disableCaching,
}: CreateStatisticQuery): Promise<{
  data: any[]
  updated_at: number
}> => {
  const queryFn = async () => {
    const data = (await ctx.prisma.$queryRaw(query, ...values)) ?? []

    console.log("data", data)
    return {
      updated_at: Date.now(),
      unit,
      data,
    }
  }

  if (disableCaching) return await queryFn()

  return await redisify(queryFn, {
    prefix: `coursestatistics_${path}`,
    expireTime,
    key: keyFn(values),
  })
}

/*const createCourseStatisticsResolver = <
  TypeName extends string,
  FieldName extends string
>(
  path: FieldName,
  query: string | TemplateStringsArray | Sql,
): FieldResolver<TypeName, FieldName> => async (
  { course_id },
  _,
  ctx,
): Promise<any> => {}
*/
export const CourseStatistics = objectType({
  name: "CourseStatistics",
  definition(t) {
    t.id("course_id")
    /*, {
      resolve: ({ course_id }) => course_id
    })*/
    t.field("started", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, __, ctx) => {
        return createStatisticsQuery({
          path: "started",
          ctx,
          query: `
              SELECT COUNT(DISTINCT user_id) as value, now() as date
              FROM user_course_setting
              WHERE course_id = $1;
          `,
          values: [course_id],
          disableCaching: true,
        })
      },
    })

    t.field("started_by_unit", {
      type: "CourseStatisticsEntry",
      args: {
        unit: nonNull(arg({ type: "TimeGroupUnit", default: "dow" })),
      },
      resolve: async ({ course_id }, { unit }, ctx) => {
        return createStatisticsQuery({
          path: "started_by_unit",
          ctx,
          query: `
            select round(extract(${unit} from created_at)) as unit_value, count(distinct ucs.user_id) as value
            from user_course_setting ucs
            where course_id = $1
            group by round(extract(${unit} from created_at));
          `,
          values: [course_id],
          unit,
          disableCaching: true,
        })
      },
    })

    t.field("started_by_interval", {
      type: "CourseStatisticsEntry",
      args: {
        number: nonNull(intArg({ default: 1 })),
        unit: nonNull(arg({ type: "IntervalUnit", default: "day" })),
      },
      resolve: async ({ course_id }, { number, unit }, ctx) => {
        const interval = getIntervalString(number, unit)

        return createStatisticsQuery({
          path: "started_by_interval",
          ctx,
          query: `
          select distinct date, count(distinct ucs.user_id) as value
            from (
              select generate_series(min(date_trunc('${unit}', created_at)), now(), '${interval}') as date
              from user_course_setting
              where course_id = $1
            ) series
            left join
              user_course_setting ucs
              on date_trunc('${unit}', created_at) > series.date - interval '${interval}' 
              and date_trunc('${unit}', created_at) <= series.date
              and course_id = $1
            group by date
            order by date
          `,
          values: [course_id],
          keyFn: (...values) => `${values[0]}-${interval.replaceAll(" ", "-")}`,
          disableCaching: true,
        })
      },
    })

    t.field("started_cumulative", {
      type: "CourseStatisticsEntry",
      args: {
        number: nonNull(intArg({ default: 1 })),
        unit: nonNull(arg({ type: "IntervalUnit", default: "day" })),
      },
      resolve: async ({ course_id }, { number, unit }, ctx) => {
        const interval = getIntervalString(number, unit)

        return createStatisticsQuery({
          path: "started_cumulative",
          ctx,
          query: `
            select distinct date, count(distinct ucs.user_id) as value
            from (
                select generate_series(min(date_trunc('${unit}', created_at)), now(), '${interval}') as date
                from user_course_setting
                where course_id = $1
                union
                select date_trunc('${unit}', now()) as date
            ) series
            left join
              user_course_setting ucs
              on date_trunc('${unit}', ucs.created_at) <= series.date
              and course_id = $1
            group by date
            order by date;
          `,
          values: [course_id],
          keyFn: (...values) => `${values[0]}-${interval.replaceAll(" ", "-")}`,
          disableCaching: true,
        })
      },
    })

    t.field("completed", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, __, ctx) => {
        return createStatisticsQuery({
          path: "completed",
          ctx,
          query: `
            SELECT COUNT(DISTINCT user_id) as value, now() as date
            FROM completion
            WHERE course_id = $1;
          `,
          values: [course_id],
          disableCaching: true,
        })
      },
    })

    t.field("completed_by_interval", {
      type: "CourseStatisticsEntry",
      args: {
        number: nonNull(intArg({ default: 1 })),
        unit: nonNull(arg({ type: "IntervalUnit", default: "day" })),
      },
      resolve: async ({ course_id }, { number, unit }, ctx) => {
        const interval = getIntervalString(number, unit)

        return createStatisticsQuery({
          path: "completed_by_interval",
          ctx,
          query: `
            select distinct date, count(distinct co.user_id) as value
            from (
              select generate_series(min(date_trunc('${unit}', created_at)), now(), '${interval}') as date
              from completion
              where course_id = $1
            ) series
            left join
              completion co
              on date_trunc('${unit}', created_at) > series.date - interval '${interval}' 
              and date_trunc('${unit}', created_at) <= series.date
              and course_id = $1
            group by date
            order by date
          `,
          values: [course_id],
          disableCaching: true,
        })
      },
    })

    t.field("completed_cumulative", {
      type: "CourseStatisticsEntry",
      args: {
        number: nonNull(intArg({ default: 1 })),
        unit: nonNull(arg({ type: "IntervalUnit", default: "day" })),
      },
      resolve: async ({ course_id }, { number, unit }, ctx) => {
        const interval = getIntervalString(number, unit)

        return createStatisticsQuery({
          path: "completed_cumulative",
          ctx,
          query: `
            select distinct date, count(distinct co.user_id) as value
            from (
                select generate_series(min(date_trunc('${unit}', created_at)), now(), '${interval}') as date
                from completion
                where course_id = $1
                union
                select date_trunc('${unit}', now()) as date
              ) series
            left join
              completion co
              on date_trunc('${unit}', co.created_at) <= series.date
            where course_id = $1
            group by date
            order by date;
          `,
          values: [course_id],
          disableCaching: true,
        })
      },
    })

    t.field("at_least_one_exercise", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, __, ctx) => {
        return createStatisticsQuery({
          path: "at_least_one_exercise",
          ctx,
          query: `
            SELECT COUNT(DISTINCT user_id) as value, now() as date
            FROM exercise_completion ec
            JOIN exercise e ON ec.exercise_id = e.id
            WHERE course_id = $1;
          `,
          values: [course_id],
          disableCaching: true,
        })
      },
    })

    t.field("at_least_one_exercise_by_interval", {
      type: "CourseStatisticsEntry",
      args: {
        number: nonNull(intArg({ default: 1 })),
        unit: nonNull(arg({ type: "IntervalUnit", default: "day" })),
      },
      resolve: async ({ course_id }, { number, unit }, ctx) => {
        const interval = getIntervalString(number, unit)

        return createStatisticsQuery({
          path: "at_least_one_exercise_by_interval",
          ctx,
          query: `
            select distinct date, count(distinct ec.user_id) as value
            from (
              select generate_series(min(date_trunc('${unit}', ec2.created_at)), now(), '${interval}') as date
              from exercise_completion ec2
              left join exercise e2 on ec2.exercise_id = e2.id
              where course_id = $1
            ) series
            left join
              exercise_completion ec
              on date_trunc('${unit}', ec.created_at) > series.date - interval '${interval}' 
              and date_trunc('${unit}', ec.created_at) <= series.date
            left join
              exercise e
              on ec.exercise_id = e.id
              and e.course_id = $1
            group by date
            order by date;
          `,
          values: [course_id],
          disableCaching: true,
        })
      },
    })

    t.field("at_least_one_exercise_cumulative", {
      type: "CourseStatisticsEntry",
      args: {
        number: nonNull(intArg({ default: 1 })),
        unit: nonNull(arg({ type: "IntervalUnit", default: "day" })),
      },
      resolve: async ({ course_id }, { number, unit }, ctx) => {
        const interval = getIntervalString(number, unit)

        return createStatisticsQuery({
          path: "at_least_one_exercise_cumulative",
          ctx,
          query: `
            select distinct date, count(distinct ec.user_id) as value
            from (
                select generate_series(min(date_trunc('${unit}', ec2.created_at)), now(), '${interval}') as date
                from exercise_completion ec2
                join exercise e2 on ec2.exercise_id = e2.id
                where course_id = $1
                union
                select date_trunc('${unit}', now()) as date
            ) series
            left join
              exercise_completion ec
              on date_trunc('${unit}', ec.created_at) <= series.date
            left join
              exercise e
              on ec.exercise_id = e.id
              and e.course_id = $1
            group by date
            order by date;
          `,
          values: [course_id],
          disableCaching: true,
        })
      },
    })
  },
})

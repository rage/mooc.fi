import { objectType } from "nexus"

export const DatedInt = objectType({
  name: "DatedInt",
  definition(t) {
    t.int("value")
    t.field("date", { type: "DateTime" })
  }
})

export const CourseStatisticsEntry = objectType({
  name: "CourseStatisticsEntry",
  definition(t) {
    t.field("updated_at", { type: "DateTime"})
    t.list.field("data", { type: "DatedInt" })
  }
})
interface DatedInt {
  value?: number
  date: number
}

export const CourseStatistics = objectType({
  name: "CourseStatistics",
  definition(t) {
    t.id("course_id")
    /*, {
      resolve: ({ course_id }) => course_id
    })*/
    t.nullable.field("started", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, __, ctx) => {
        return await redisify(
          async () => {
            const started = await ctx.prisma.$queryRaw(
              `
              SELECT COUNT(DISTINCT user_id) as value, now() as date
              FROM user_course_setting
              WHERE course_id = $1;
            `,
              course_id,
            )

            return {
              updated_at: Date.now(),
              data: started ?? []
            }
          },
          {
            prefix: "coursestatistics_startedz",
            expireTime: 1, // 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })

    t.nullable.field("cumulative_started", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, _, ctx) => {
        return await redisify(
          async () => {
            const started = await ctx.prisma.$queryRaw(
              `
            select distinct date, count(distinct ucs.user_id) as value
            from (
                select generate_series(min(date_trunc('day', created_at)), now(), '1 week') as date
                from user_course_setting
                where course_id = $1
                union
                select date_trunc('day', now()) as date
            ) series
            left join
              user_course_setting ucs
              on ucs.created_at < series.date
            where course_id = $1
            group by date
            order by date;
            `,
              course_id,
            )

            return {
              updated_at: Date.now(),
              data: started ?? []
            }
          },
          {
            prefix: "coursestatistics_cumulative_started",
            expireTime: 1, // 24 * 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })
    t.nullable.field("completed", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, __, ctx) => {
        return await redisify(
          async () => {
            const completed = await ctx.prisma.$queryRaw(
              `
              SELECT COUNT(DISTINCT user_id) as value, now() as date
              FROM completion
              WHERE course_id = $1;
            `,
              course_id,
            )

            return {
              updated_at: Date.now(),
              date: completed ?? []
            }
          },
          {
            prefix: "coursestatistics_completed",
            expireTime: 1, // 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })

    t.nullable.field("cumulative_completed", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, _, ctx) => {
        return await redisify(
          async () => {
            const completed = await ctx.prisma.$queryRaw(
              `
          select distinct date, count(distinct co.user_id) as value
          from (
              select generate_series(min(date_trunc('day', created_at)), now(), '1 week') as date
              from completion
              where course_id = $1
              union
              select date_trunc('day', now()) as date
            ) series
          left join
            completion co
            on co.created_at < series.date
          where course_id = $1
          group by date
          order by date;
          `,
              course_id,
            )

            return {
              updated_at: Date.now(),
              data: completed ?? []
            }
          },
          {
            prefix: "coursestatistics_cumulative_completed",
            expireTime: 1, // 24 * 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })

    t.nullable.field("at_least_one_exercise", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, __, ctx) => {
        return await redisify(
          async () => {
            const atLeastOne = await ctx.prisma.$queryRaw(
              `
              SELECT COUNT(DISTINCT user_id) as value, now() as date
              FROM exercise_completion ec
              JOIN exercise e ON ec.exercise_id = e.id
              WHERE course_id = $1;
            `,
              course_id,
            )

            return {
              updated_at: Date.now(),
              data: atLeastOne ?? []
            }
          },
          {
            prefix: "coursestatistics_atLeastOneExercise",
            expireTime: 1, // 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })

    t.nullable.field("cumulative_at_least_one_exercise", {
      type: "CourseStatisticsEntry",
      resolve: async ({ course_id }, _, ctx) => {
        const atLeastOne = await ctx.prisma.$queryRaw(
          `
      select distinct date, count(distinct ec.id) as value
      from (
          select generate_series(min(date_trunc('week', ec2.created_at)), now(), '1 week') as date
          from exercise_completion ec2
          join exercise e2 on ec2.exercise_id = e2.id
          where course_id = $1
          union
          select date_trunc('day', now()) as date
      ) series
      left join
        exercise_completion ec
        on ec.created_at < series.date
      left join
        exercise e
        on ec.exercise_id = e.id
      where e.course_id = $1
      group by date
      order by date;
      `,
          course_id,
        )

        return {
          updated_at: Date.now(),
          data: atLeastOne ?? []
        }
        return await redisify<DatedInt>(
          async () => {
            const atLeastOne = await ctx.prisma.$queryRaw(
              `
          select distinct date, count(distinct ec.user_id) as value
          from (
              select generate_series(min(date_trunc('day', ec2.created_at)), now(), '1 week') as date
              from exercise_completion ec2
              join exercise e2 on ec2.exercise_id = e2.id
              where course_id = $1
              union
              select date_trunc('day', now()) as date
          ) series
          left join
            exercise_completion ec
            on ec.created_at < series.date
          left join
            exercise e
            on ec.exercise_id = e.id
          where e.course_id = $1
          group by date
          order by date;
          `,
              course_id,
            )

            return atLeastOne
          },
          {
            prefix: "coursestatistics_cumulative_atLeastOneExercise",
            expireTime: 0, // 24 * 60 * 60 * 1000,
            key: `${course_id}`,
          },
        )
      },
    })
  }
})
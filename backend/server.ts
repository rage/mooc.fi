const PRODUCTION = process.env.NODE_ENV === "production"

import { UserInfo } from "./domain/UserInfo"
import Knex from "./services/knex"
import { redisify } from "./services/redis"
import TmcClient, { authenticateUser, createUser, getCurrentUserDetails } from "./services/tmc"
import { User, Completion, PrismaClient } from "@prisma/client"
import cors from "cors"
import morgan from "morgan"
import { ok, err, Result } from "./util/result"
import createExpress from "express"
import schema from "./schema"
import { ApolloServer } from "apollo-server-express"
import * as winston from "winston"
import { validateEmail, validatePassword } from "./util/validateAuth"

const JSONStream = require("JSONStream")
const helmet = require("helmet")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const argon2 = require('argon2')

const DEBUG = Boolean(process.env.DEBUG)
const TEST = process.env.NODE_ENV === "test"

type UserCourseSettingsCountResult =
  | {
      course: string
      language: string
      count?: number
    }
  | {
      course: string
      language: string
      error: true
    }

interface ExerciseCompletionResult {
  user_id: string
  exercise_id: string
  n_points: string
  part: number
  section: number
  max_points: number
  completed: boolean
  quizzes_id: string
}

// wrapped so that the context isn't cached between test instances
const _express = () => {
  const express = createExpress()

  express.use(cors())
  express.use(helmet.frameguard())
  express.use(cookieParser())
  express.use(bodyParser.json())
  if (!TEST) {
    express.use(morgan("combined"))
  }

  express.get("/api/completions/:course", async function (req: any, res: any) {
    const rawToken = req.get("Authorization")
    const secret: string = rawToken?.split(" ")[1] ?? ""

    let course_id: string
    const org = (
      await Knex.select("*")
        .from("organization")
        .where({ secret_key: secret })
        .limit(1)
    )[0]
    if (!org) {
      return res.status(401).json({ message: "Access denied." })
    }
    const course = (
      await Knex.select("id")
        .from("course")
        .where({ slug: req.params.course })
        .limit(1)
    )[0]
    if (!course) {
      const course_alias = (
        await Knex.select("course_id")
          .from("course_alias")
          .where({ course_code: req.params.course })
      )[0]
      if (!course_alias) {
        return res.status(404).json({ message: "Course not found" })
      }
      course_id = course_alias.course_id
    } else {
      course_id = course.id
    }
    const sql = Knex.select("*").from("completion").where({
      course_id,
      eligible_for_ects: true,
    })
    res.set("Content-Type", "application/json")
    const stream = sql.stream().pipe(JSONStream.stringify()).pipe(res)
    req.on("close", stream.end.bind(stream))
  })

  express.get(
    "/api/usercoursesettingscount/:course/:language",
    async (req: any, res: any) => {
      const {
        course,
        language,
      }: { course: string; language: string } = req.params

      if (!course || !language) {
        return res
          .status(400)
          .json({ message: "Course and/or language not specified" })
      }

      const resObject = await redisify<UserCourseSettingsCountResult>(
        async () => {
          let course_id: string

          const { id } =
            (
              await Knex.select("course.id")
                .from("course")
                .join("user_course_settings_visibility", {
                  "course.id": "user_course_settings_visibility.course_id",
                })
                .where({
                  slug: course,
                  "user_course_settings_visibility.language": language,
                })
                .limit(1)
            )[0] ?? {}

          if (!id) {
            const courseAlias = (
              await Knex.select("course_alias.course_id")
                .from("course_alias")
                .join("course", { "course_alias.course_id": "course.id" })
                .join("user_course_settings_visibility", {
                  "course.id": "user_course_settings_visibility.course_id",
                })
                .where({
                  course_code: course,
                  "user_course_settings_visibility.language": language,
                })
            )[0]
            course_id = courseAlias?.course_id
          } else {
            course_id = id
          }

          if (!course_id) {
            return { course, language, error: true }
          }

          let { count } = (
            await Knex.countDistinct("id as count")
              .from("user_course_setting")
              .where({ course_id, language: language })
          )?.[0]

          if (count < 100) {
            count = -1
          } else {
            const factor = 100
            count = Math.floor(Number(count) / factor) * factor
          }

          return { course, language, count: Number(count) }
        },
        {
          prefix: "usercoursesettingscount",
          expireTime: 3600000, // hour
          key: `${course}-${language}`,
        },
      )

      if (resObject.error) {
        return res.status(403).json({
          message: "Course not found or user count not set to visible",
        })
      }

      res.json(resObject)
    },
  )

  /*const baiCourseTiers: Record<string, string> = {
  "e1eaff32-8b2c-4423-998d-d3477535a1f9": "beginner",
  "3a2790fc-227c-4045-9f4c-40a2bdabe76a": "intermediate",
  "0e9d1a22-0e19-4320-8c8c-84115bb26452": "advanced",
}*/

  express.get("/api/progress/:id", async (req: any, res: any) => {
    const { id }: { id: string } = req.params

    if (!id) {
      return res.status(400).json({ message: "must provide id" })
    }

    const getUserResult = await getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const exercise_completions = await Knex.select<
      any,
      ExerciseCompletionResult[]
    >(
      "user_id",
      "exercise_id",
      "n_points",
      "part",
      "section",
      "max_points",
      "completed",
      "custom_id as quizzes_id",
    )
      .from("exercise_completion")
      .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
      .where("exercise.course_id", id)
      .andWhere("exercise_completion.user_id", user.id)

    const resObject = (exercise_completions ?? []).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.exercise_id]: {
          ...curr,
          // tier: baiCourseTiers[curr.quizzes_id],
        },
      }),
      {},
    )

    res.json({
      data: resObject,
    })
  })

  express.get("/api/progressv2/:id", async (req: any, res: any) => {
    const { id }: { id: string } = req.params

    if (!id) {
      return res.status(400).json({ message: "must provide id" })
    }

    const getUserResult = await getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const exercise_completions = await Knex.select<
      any,
      ExerciseCompletionResult[]
    >(
      "user_id",
      "exercise_id",
      "n_points",
      "part",
      "section",
      "max_points",
      "completed",
      "custom_id as quizzes_id",
    )
      .from("exercise_completion")
      .join("exercise", { "exercise_completion.exercise_id": "exercise.id" })
      .where("exercise.course_id", id)
      .andWhere("exercise_completion.user_id", user.id)
    const { completions_handled_by_id = id } =
      (
        await Knex.select("completions_handled_by_id")
          .from("course")
          .where("id", id)
      )[0] ?? {}

    const completions = await Knex.select<any, Completion[]>("*")
      .from("completion")
      .where("course_id", completions_handled_by_id)
      .andWhere("user_id", user.id)

    const exercise_completions_map = (exercise_completions ?? []).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.exercise_id]: {
          ...curr,
          // tier: baiCourseTiers[curr.quizzes_id],
        },
      }),
      {},
    )

    res.json({
      data: {
        course_id: id,
        user_id: user.id,
        exercise_completions: exercise_completions_map,
        completion: completions[0] ?? {},
      },
    })
  })

  express.get("/api/tierprogress/:id", async (req: any, res: any) => {
    const { id }: { id: string } = req.params

    if (!id) {
      return res.status(400).json({ message: "must provide course id" })
    }

    const getUserResult = await getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const { user } = getUserResult.value

    const data = await Knex.select<any, any>("course_id", "extra")
      .from("user_course_progress")
      .where("user_course_progress.course_id", id)
      .andWhere("user_course_progress.user_id", user.id)

    res.json({
      data: {
        course_id: id,
        ...data[0]?.extra,
      },
    })
  })

  express.post("/api/signUp", async (req: any, res: any) => {
    let email = req.body.email.trim()
    let password = req.body.password.trim()
    let confirmPassword = req.body.confirmPassword.trim()
    let username = req.body.username.trim()

    if(email.length > 64 || !validateEmail(email)) {
      return res.status(400).json({
        error: 'Email is invalid or too long.'
      })
    }

    if(!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password is invalid.'
      })
    }

    if(password !== confirmPassword) {
      return err(res.status(400).json({
        success: false,
        message: "Confirmation password must match new password"
      }))
    }

    const checkEmail = await Knex.select("email")
      .from("prisma2.user")
      .where("email", email)

    if(checkEmail.length > 0) {
      return res.status(400).json({
        success:false,
        message: 'Email is already in use.'
      })
    }

    const checkUsername = await Knex.select("username")
      .from("prisma2.user")
      .where("username", username)
      
    if(checkUsername.length > 0) {
      return res.status(400).json({
        success:false,
        message: 'Username is already in use.'
      })
    }
    
    const accessToken = await createUser(email, username, password, confirmPassword)
    if(!accessToken.success) {
      return err(res.status(500).json({ success: false, message: "Error creating user", error: accessToken.error }))
    }

    const userDetails = await getCurrentUserDetails(accessToken.token)

    const hashPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 4,
      memoryCost: 15360,
      hashLength: 64,
    })
    
    let user = (
      await Knex.select<any, User[]>("id").from("prisma2.user").where("upstream_id", userDetails.id)
    )?.[0]

    if(!user) {
      try {
        user = (
          await Knex("prisma2.user").insert({
            upstream_id: userDetails.id,
            email,
            username,
            password: hashPassword,
            administrator: userDetails.administrator
          })
          .returning("*")
        )?.[0]
      } catch(error) {
        return err(res.status(500).json({ message: "Error creating user", error }))
      }  
    }
   
    return res.status(200).json({
      success: true,
      userDetails
    })
  })

  express.post("/api/signIn", async (req: any, res: any) => {
    let email = req.body.email.trim()
    let password = req.body.password.trim()

    let user = (
      await Knex.select<any, User[]>("id", "password").from("prisma2.user").where("email", email)
    )?.[0]

    if(!user) {
      return err(res.status(404).json({ message: "User not found" }))
    }

    if (await argon2.verify(user.password, password)) {
      const accessToken = await authenticateUser(email, password)

      express.use(session({
        secret: accessToken.token,
        cookie: {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          secure: true
        },
        saveUninitialized: false,
        resave: false,
        unset: 'keep'
      }));


      //Temp for Dev
      return res.status(200).cookie(
        'access_token', accessToken.token, {
          expires: new Date(Date.now() + 8 * 3600000)
        }).json({
          success: true,
          access_token: accessToken.token
        })
      ////

      return res.status(200).json({
        success: true,
        access_token: accessToken.token
      })

    } else {
      return err(res.status(403).json({ message: "Password does not match", err }))
    }
  })

  express.post("/api/signOut", async (req: any, res: any) => {
    req.session = null

    return res.status(200).json({
      sucess: true
    })
  })

  express.post("/api/passwordReset", async (req: any, res: any) => {
    let email = req.body.email.trim()

    if(!email || email === "") {
      return err(res.status(400).json({
        success: false,
        message: "No email address provided"
      }))
    }

    let user = (
      await Knex.select<any, User[]>("email").from("prisma2.user").where("email", email)
    )?.[0]

    if(!user) {
      return err(res.status(404).json({ 
        success: false,
        message: "No such email address registered" 
      }))
    }

    const key = crypto.randomBytes(20).toString('hex')
    await Knex("prisma2.user").where({ email }).update({ password_reset: key })

    //Email Password Link to User
    //Create Password Reset Form as Renderable Page
    //Figure out how to make this work with TMC
  })

  express.post("/api/storePasswordReset", async (req: any, res: any) => {
    let password = req.body.password.trim()
    let confirmPassword = req.body.confirmPassword.trim()
    let token = req.query.token

    if(!token || token === null || token === "") {
      return err(res.status(400).json({
        success: false,
        message: "Token is invalid."
      }))
    }

    if(!validatePassword(password)) {
      return err(res.status(400).json({
        success: false,
        message: "Password is invalid."
      }))
    }

    if(password !== confirmPassword) {
      return err(res.status(400).json({
        success: false,
        message: "Confirmation password must match new password"
      }))
    }

    let user = (
      await Knex.select<any, User[]>("password_reset").from("prisma2.user").where("password_reset", token)
    )?.[0]

    if(!user) {
      return err(res.status(404).json({
        success: false,
        message: "Token is invalid or expired"
      }))
    }

    const hashPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 4,
      memoryCost: 15360,
      hashLength: 64,
    })

    await Knex("prisma2.user").where("password_reset", token).update({ password: hashPassword, password_reset: null })

    return res.status(200).json({
      success: true
    })
  })

  interface GetUserReturn {
    user: User
    details: UserInfo
  }

  async function getUser(
    req: any,
    res: any,
  ): Promise<Result<GetUserReturn, any>> {
    const rawToken = req.get("Authorization")

    if (!rawToken || !(rawToken ?? "").startsWith("Bearer")) {
      return err(res.status(400).json({ message: "not logged in" }))
    }

    let details: UserInfo | null = null
    try {
      const client = new TmcClient(rawToken)
      details = await redisify<UserInfo>(
        async () => await client.getCurrentUserDetails(),
        {
          prefix: "userdetails",
          expireTime: 3600,
          key: rawToken,
        },
      )
    } catch (e) {
      console.log("error", e)
    }

    if (!details) {
      return err(res.status(400).json({ message: "invalid credentials" }))
    }

    let user = (
      await Knex.select<any, User[]>("id")
        .from("user")
        .where("upstream_id", details.id)
    )?.[0]

    if (!user) {
      try {
        user = (
          await Knex("user")
            .insert({
              upstream_id: details.id,
              administrator: details.administrator,
              email: details.email.trim(),
              first_name: details.user_field.first_name.trim(),
              last_name: details.user_field.last_name.trim(),
              username: details.username,
            })
            .returning("*")
        )?.[0]
      } catch {
        // race condition or something
        user = (
          await Knex.select<any, User[]>("id")
            .from("user")
            .where("upstream_id", details.id)
        )?.[0]

        if (!user) {
          return err(res.status(500).json({ message: "error creating user" }))
        }
      }
    }

    return ok({
      user,
      details,
    })
  }

  return express
}

interface ServerParams {
  prisma: PrismaClient
  logger: winston.Logger
  extraContext?: Record<string, any>
}

export default ({ prisma, logger, extraContext = {} }: ServerParams) => {
  const apollo = new ApolloServer({
    context: (ctx) => ({
      ...ctx,
      prisma,
      logger,
      ...extraContext,
    }),
    schema,
    playground: {
      endpoint: PRODUCTION ? "/api" : "/",
    },
    introspection: true,
    logger,
    debug: DEBUG,
  })
  const express = _express()

  apollo.applyMiddleware({ app: express, path: PRODUCTION ? "/api" : "/" })

  return {
    apollo,
    express,
  }
}

// export default express
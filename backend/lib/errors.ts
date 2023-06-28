import { GraphQLError, GraphQLErrorOptions } from "graphql/error"

import { stringifyWithIndent } from "../util/json"

class CustomError extends Error {
  constructor(message: string) {
    super(message)

    Object.defineProperty(this, "name", { value: new.target.name })
    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this, this.constructor)
  }
}

export abstract class Warning extends Error {
  constructor(message: string) {
    super(message)

    Object.defineProperty(this, "name", { value: new.target.name })
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

class CustomGraphQLError extends GraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, options)

    Object.defineProperty(this, "name", { value: new.target.name })
    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this, this.constructor)
  }
}

export class GraphQLGenericError extends CustomGraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, options)
  }
}

export class GraphQLUserInputError extends CustomGraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions)
  constructor(
    message: string,
    argumentName: string | string[],
    options?: GraphQLErrorOptions,
  )
  constructor(
    message: string,
    argumentNameOrOptions?: string | string[] | GraphQLErrorOptions,
    options?: GraphQLErrorOptions,
  ) {
    let argumentName: string | string[] | undefined
    let opt = options

    if (
      typeof argumentNameOrOptions === "string" ||
      Array.isArray(argumentNameOrOptions)
    ) {
      argumentName = argumentNameOrOptions
    } else {
      opt = argumentNameOrOptions
    }

    super(message, {
      ...opt,
      extensions: {
        ...opt?.extensions,
        code: "BAD_USER_INPUT",
        argumentName,
      },
    })
  }
}

export class GraphQLAuthenticationError extends CustomGraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        ...options?.extensions,
        code: "UNAUTHENTICATED",
      },
    })
  }
}

export class GraphQLForbiddenError extends CustomGraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        ...options?.extensions,
        code: "FORBIDDEN",
      },
    })
  }
}

export class UserInputError extends CustomError {
  constructor(message: string, data?: object)
  constructor(message: string, readonly data?: object) {
    super(message)
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string) {
    super(message)
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message)
  }
}

export class TMCError extends CustomError {
  constructor(message: string, error?: any)
  constructor(message: string, data?: object, error?: any)
  constructor(message: string, readonly data?: object, readonly error?: any) {
    super(message)
  }
}

export class DatabaseInputError extends CustomError {
  constructor(message: string, data?: object)
  constructor(message: string, data?: object, error?: Error)
  constructor(message: string, readonly data?: object, readonly error?: Error) {
    super(message)
  }
}

export class KafkaMessageError extends CustomError {
  constructor(message: string, kafkaMessage?: object)
  constructor(message: string, kafkaMessage?: object, error?: Error)
  constructor(
    message: string,
    readonly kafkaMessage?: object,
    readonly error?: Error,
  ) {
    super(message)
  }
}

export class KafkaCommitError extends CustomError {
  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}

export class KafkaError extends CustomError {
  constructor(message: string, readonly error: any) {
    super(`${message}; original message: ${error?.message}`)
  }
}

export class ValidationError extends CustomError {
  data_string: string

  constructor(message: string, readonly data: object, readonly error?: Error) {
    super(message)
    this.data_string = stringifyWithIndent(data ?? {})
  }
}

export class SlackPosterError extends CustomError {
  constructor(message: string, readonly error: Error) {
    super(message)
  }
}

export class EmailTemplaterError extends CustomError {
  constructor(message: string, error?: Error)
  constructor(message: string, data?: object, error?: Error)
  constructor(message: string, readonly data?: object, readonly error?: Error) {
    super(message)
  }
}

export class AvoinError extends CustomError {
  constructor(message: string, readonly data: object, readonly error?: Error) {
    super(message)
  }
}

export class RemoveDuplicateCompletionsError extends CustomError {
  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}

export class RemoveDuplicateExerciseCompletionsError extends CustomError {
  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}

export class PruneOldStoredDataError extends CustomError {
  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}
export class CourseStatsEmailerError extends CustomError {
  constructor(message: string, readonly Erorr?: Error) {
    super(message)
  }
}

export class TimestampWarning extends Warning {
  constructor(message: string) {
    super(message)
  }
}

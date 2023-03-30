import { GraphQLError, GraphQLErrorOptions } from "graphql/error"

class CustomError extends Error {
  constructor(message: string) {
    super(message)

    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}

export abstract class Warning extends Error {
  constructor(message: string) {
    super(message)

    this.name = this.constructor.name
  }
}

class CustomGraphQLError extends GraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, options)

    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}

export class GraphQLUserInputError extends CustomGraphQLError {
  override name = "UserInputError"

  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, options)
  }
}

export class GraphQLAuthenticationError extends CustomGraphQLError {
  override name = "AuthenticationError"

  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, options)
  }
}

export class GraphQLForbiddenError extends CustomGraphQLError {
  override name = "ForbiddenError"

  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, options)
  }
}

export class UserInputError extends CustomError {
  override name = "UserInputError"

  constructor(message: string, data?: object)
  constructor(message: string, readonly data?: object) {
    super(message)
  }
}

export class AuthenticationError extends CustomError {
  override name = "AuthenticationError"

  constructor(message: string) {
    super(message)
  }
}

export class ForbiddenError extends CustomError {
  override name = "ForbiddenError"

  constructor(message: string) {
    super(message)
  }
}

export class TMCError extends CustomError {
  override name = "TMCError"

  constructor(message: string, error?: any)
  constructor(message: string, data?: object, error?: any)
  constructor(message: string, readonly data?: object, readonly error?: any) {
    super(message)
  }
}

export class DatabaseInputError extends CustomError {
  override name = "DatabaseInputError"

  constructor(message: string, data?: object)
  constructor(message: string, data?: object, error?: Error)
  constructor(message: string, readonly data?: object, readonly error?: Error) {
    super(message)
  }
}

export class KafkaMessageError extends CustomError {
  override name = "KafkaMessageError"

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
  override name = "KafkaCommitError"

  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}

export class KafkaError extends CustomError {
  override name = "KafkaError"

  constructor(message: string, readonly error: any) {
    super(`${message}; original message: ${error?.message}`)
  }
}

export class ValidationError extends CustomError {
  override name = "ValidationError"
  data_string: string

  constructor(message: string, readonly data: object, readonly error?: Error) {
    super(message)
    this.data_string = JSON.stringify(data ?? {})
  }
}

export class SlackPosterError extends CustomError {
  override name = "SlackPosterError"

  constructor(message: string, readonly error: Error) {
    super(message)
  }
}

export class EmailTemplaterError extends CustomError {
  override name = "EmailTemplaterError"

  constructor(message: string, error?: Error)
  constructor(message: string, data?: object, error?: Error)
  constructor(message: string, readonly data?: object, readonly error?: Error) {
    super(message)
  }
}

export class AvoinError extends CustomError {
  override name = "AvoinError"

  constructor(message: string, readonly data: object, readonly error?: Error) {
    super(message)
  }
}

export class RemoveDuplicateCompletionsError extends CustomError {
  override name = "RemoveDuplicateCompletionsError"

  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}

export class RemoveDuplicateExerciseCompletionsError extends CustomError {
  override name = "RemoveDuplicateExerciseCompletionsError"

  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}

export class PruneOldStoredDataError extends CustomError {
  override name = "PruneOldStoredDataError"

  constructor(message: string, readonly error?: Error) {
    super(message)
  }
}
export class CourseStatsEmailerError extends CustomError {
  override name = "CourseStatsEmailerError"

  constructor(message: string, readonly Erorr?: Error) {
    super(message)
  }
}

export class TimestampWarning extends Warning {
  override name = "TimestampWarning"

  constructor(message: string) {
    super(message)
  }
}

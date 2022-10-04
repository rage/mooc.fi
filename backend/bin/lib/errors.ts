class CustomError extends Error {
  constructor(message: string) {
    super(message)

    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
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

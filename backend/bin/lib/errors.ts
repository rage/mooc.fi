class CustomError extends Error {
  constructor(message: string) {
    super(message)

    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }
}

export class TMCError extends CustomError {
  name = "TMCError"
}

export class DatabaseError extends CustomError {
  name = "DatabaseError"
}

export class InvalidKafkaMessageError extends CustomError {
  name = "InvalidKafkaMessageError"

  constructor(message: string, readonly kafkaMessage?: object) {
    super(message)
  }
}

export class ValidationError extends CustomError {
  name = "ValidationError"

  constructor(message: string, readonly data?: object) {
    super(message)
  }
}

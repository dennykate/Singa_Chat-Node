// NotFoundError class for 404 errors
export class NotFoundError extends Error {
  constructor(message = "Not found") {
    super(message);
    this.statusCode = 404;
  }
}

// UnauthenticatedError class for 403 errors
export class UnauthenticatedError extends Error {
  constructor(message = "Unauthenticated") {
    super(message);
    this.statusCode = 403;
  }
}

// UnauthorizedError class for 401 errors
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.statusCode = 401;
  }
}

// InternalServerError class for 500 errors
export class InternalServerError extends Error {
  constructor(message = "Internal server error") {
    super(message);
    this.statusCode = 500;
  }
}

// BadRequestError class for 400 errors
export class BadRequestError extends Error {
  constructor(message = "Something wrong") {
    super(message);
    this.statusCode = 400;
  }
}

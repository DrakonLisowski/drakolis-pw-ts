// tslint:disable: max-classes-per-file
import { Server, JSONRPCError } from 'jayson';

interface IErrorDefinition {
  code: number;
  message: string;
}

class ThrowableError extends Error implements JSONRPCError {
  constructor(public code: number, message: string) {
    super(message);
  }
}

export class InvalidRequestError extends ThrowableError {
  constructor() {
    super(Server.errors.INVALID_REQUEST, Server.errorMessages[Server.errors.INVALID_REQUEST]);
  }
}

export class BadRequestError extends ThrowableError {
  constructor() {
    super(-10400, 'Bad arguments');
  }
}

export class UnathorizedError extends ThrowableError {
  constructor() {
    super(-10401, 'Unathorized');
  }
}

export class ForbiddenError extends ThrowableError {
  constructor() {
    super(-10403, 'Action Forbidden');
  }
}

export class AlwaysFailError extends ThrowableError {
  constructor() {
    super(-99999, 'This method always fails');
  }
}

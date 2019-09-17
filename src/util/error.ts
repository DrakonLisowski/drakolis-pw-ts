import { Server } from 'jayson';

export const ERROR = {
  // Specification errors
  INVALID_REQUEST: {
    code: Server.errors.INVALID_REQUEST,
    message: Server.errorMessages[Server.errors.INVALID_REQUEST],
  },
  // 10xxx -- Global errors
  BAD_ARGUMENTS: { code: -10400, message: 'Bad arguments' },
  UNATHORIZED: { code: -10401, message: 'Unathorized' },
  FORBIDDEN: { code: -10403, message: 'Action Forbidden' },
};

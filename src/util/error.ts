import { Server } from 'jayson';

export const ERROR = {
  // Specification errors
  INVALID_REQUEST: {
    code: Server.errors.INVALID_REQUEST,
    message: Server.errorMessages[Server.errors.INVALID_REQUEST],
  },
  // 10xxx -- Global errors
  UNATHORIZED: { code: -10403, message: 'Unathorized' },
  BAD_ARGUMENTS: { code: -10402, message: 'Bad arguments' },
};

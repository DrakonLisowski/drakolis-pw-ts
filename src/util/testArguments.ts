import { JSONRPCCallbackTypePlain, RequestParamsLike } from 'jayson';
import { ERROR } from './error';

const testArguments = (
  test: (args: RequestParamsLike) => object,
  args: RequestParamsLike,
  callback: JSONRPCCallbackTypePlain,
) => {
  const errors = test(args);
  if (errors) {
    callback({ ...ERROR.BAD_ARGUMENTS, data: errors });
  }
};

export default testArguments;

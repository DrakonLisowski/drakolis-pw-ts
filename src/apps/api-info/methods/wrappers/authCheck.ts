import { MethodHandler, JSONRPCCallbackTypePlain, RequestParamsLike } from 'jayson';
import { IAuthorizable, testIAuthorizable } from '../arguments/IAuthorizable';
import { ERROR } from '../../../../util/error';
import testArguments from '../../../../util/testArguments';

const authCheck = (next: MethodHandler): MethodHandler => {
  return (
    args: IAuthorizable,
    callback: JSONRPCCallbackTypePlain,
  ) => {
    testArguments(testIAuthorizable, args, callback);
    const authToken = args.token;
    if (authToken !== 'DRAKOLIS-RULZ-OK') {
      callback(ERROR.UNATHORIZED);
    }
    return next.call(this, args, callback);
  };
};

export default authCheck;

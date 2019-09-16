import { MethodHandler, JSONRPCCallbackTypePlain } from 'jayson';
import IAuthorizable from '../../arguments/IAuthorizable';
import { ERROR } from '../../../../util/error';

const authCheck = (next: MethodHandler): MethodHandler => {
  return (
    args: IAuthorizable,
    callback: JSONRPCCallbackTypePlain,
  ) => {
    const authToken = args.token;
    if (authToken !== 'DRAKOLIS-RULZ-OK') {
      callback(ERROR.UNATHORIZED);
    }
    return next.call(this, args, callback);
  };
};

export default authCheck;

/*
authed(fn) {
  return function(args, done) {
    var auth = args.auth;
    // validate auth token
    return fn.call(this, args, done); // pass on like a middleware
  };
*/

import { Method, MethodHandler } from 'jayson';
import authCheck from './wrappers/authCheck';

const penis = '8===D';

const drawAPenis: MethodHandler = (args, callback) => {
  callback(null, penis);
};

const methods = () => ({
  drawAPenis: new Method(drawAPenis),
  drawAPenisAuth: new Method(authCheck(drawAPenis)),
});

export default methods;

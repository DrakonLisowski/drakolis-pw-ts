import { Method, MethodHandler } from 'jayson';
import authCheck from './wrappers/authCheck';

const penis =
`
……………………………………….¸„„„„
…………………….…………...„--~*'¯…….'\
………….…………………… („-~~--„¸_….,/ì'Ì
…….…………………….¸„-^"¯ : : : : :¸-¯"¯/'
……………………¸„„-^"¯ : : : : : : : '\¸„„,-"
**¯¯¯'^^~-„„„---~^*'"¯ : : : : : : : : : :¸"
.:.:.:.:.„-^" : : : : : : : : : : : : : : : : :„-"
:.:.:.:.:.:.:.:.:.:.: : : : : : : : : : ¸„-^¯
.::.:.:.:.:.:.:.:. : : : : : : : ¸„„-^¯
:.' : : '\ : : : : : : : ;¸„„-~"
:.:.:: :"-„""***/*'ì¸'¯
:.': : : : :"-„ : : :"\
.:.:.: : : : :" : : : : \,
:.: : : : : : : : : : : : 'Ì
: : : : : : :, : : : : : :/
"-„_::::_„-*__„„~"﻿
`;

const drawAPenis: MethodHandler = (args, callback) => {
  callback(null, penis);
};

const methods = () => ({
  drawAPenis: new Method(authCheck(drawAPenis)),
  drawAPenisAuth: new Method(authCheck(drawAPenis)),
});

export default methods;

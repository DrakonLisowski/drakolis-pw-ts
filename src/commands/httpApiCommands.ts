import Command from './Command';
import AlwaysFail from './test/AlwaysFail';
import DrawAPenis from './test/DrawAPenis';
import GetUserID from './IGC/GetUserID';
// import GetUserInfo from './IGC/GetUserInfo';
// import LoadUserFollowers from './IGC/LoadUserFollowers';

const HTTPApiCommands: Command[] = [
  AlwaysFail,
  DrawAPenis,
  GetUserID,
  // GetUserInfo,
  // LoadUserFollowers,
];

export default HTTPApiCommands;

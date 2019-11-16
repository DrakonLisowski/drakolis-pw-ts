import { NodeMessage } from 'veza';

interface IPCMessageData {
  name: string;
  data: object;
}

class IPCMessage extends NodeMessage {
  public data: IPCMessageData;
}

export default IPCMessage;

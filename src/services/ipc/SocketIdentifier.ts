import AllowedSocket from './AllowedSocket';

export default class SocketIdentifier {
  constructor(public name: AllowedSocket, public id?: number) {}

  public buildName(): string {
    if (this.id) {
      return `${this.name}-${this.id}`;
    }
    return `${this.name}`;
  }
}

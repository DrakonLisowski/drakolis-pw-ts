export default (timeout: number, message: string) =>
  new Promise((res, rej) =>
    setTimeout(() => rej(new Error(message)), timeout),
  );

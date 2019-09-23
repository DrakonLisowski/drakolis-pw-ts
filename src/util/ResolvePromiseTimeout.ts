export default (timeout: number, result: any): any =>
  new Promise((res, rej) =>
    setTimeout(() => res(result), timeout),
  );

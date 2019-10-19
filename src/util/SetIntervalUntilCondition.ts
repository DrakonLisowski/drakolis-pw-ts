export default (
  repeatFunction: () => any,
  exitCondition: () => boolean,
  interval: number,
  timeout: number,
  timeoutMessage: string = 'Promise timeout'
): any =>
  new Promise((res, rej) => {
    const die = setTimeout(() => rej(new Error(timeoutMessage)), timeout);
    const execute = setInterval(() => {
      const result = repeatFunction();
      if (exitCondition()) {
        clearTimeout(die);
        clearInterval(execute);
        res(result);
      }
    }, interval);
  });

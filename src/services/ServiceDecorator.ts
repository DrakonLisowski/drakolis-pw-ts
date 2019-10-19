export type Type<T> = new (...args: any[]) => T;

export type GenericClassDecorator<T> = (target: T) => void;

export const Service = (): GenericClassDecorator<Type<object>> => {
  return (target: Type<object>) => {
    /* Should check if we extend the proper stuff (interface dies here, need to think) */
  };
};

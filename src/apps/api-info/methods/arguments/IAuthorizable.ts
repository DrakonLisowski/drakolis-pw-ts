export interface IAuthorizable {
  token: string;
}
export function testIAuthorizable(object: IAuthorizable): object {
  const errors: any = {};
  if (object.token) {
    errors.token = 'parameter missing';
  } else if (typeof object.token === 'string') {
    errors.token = 'must be a string';
  }
  return Object.keys(errors).length > 0 && errors;
}

import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

export function jwtToLoginPayload(jwtAuth: string): LoginPayload {
  const jwtSplited = jwtAuth.split('.');

  if (jwtSplited.length < 3 || !jwtSplited.at(1)) {
    return undefined;
  }

  return JSON.parse(Buffer.from(jwtSplited.at(1), 'base64').toString('ascii'));
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { jwtToLoginPayload } from '../utils/base64Converter';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const { authorization } = ctx.switchToHttp().getRequest().headers;

  const loginPayload = jwtToLoginPayload(authorization);

  // console.log('jwtId', loginPayload.id);

  return loginPayload?.id;
});

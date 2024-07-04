import { createParamDecorator } from '@nestjs/common'

export const CurrentUserJoin = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest()
  delete req.user.iat
  delete req.user.exp
  return req.user
})

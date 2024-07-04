import { ParseUUIDPipe, HttpStatus, BadRequestException } from '@nestjs/common'

export class IsUuidPipe extends ParseUUIDPipe {
  constructor() {
    super({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: () => {
        throw new BadRequestException('Provid valid uuid format')
      },
    })
  }
}

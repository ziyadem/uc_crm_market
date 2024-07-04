import { Controller, Post, Body } from '@nestjs/common'
import {
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RefreshDto, SignInDto } from './dtos'

@ApiTags('Auth')
@Controller({
  path: 'auth/',
  version: '1',
})
export class AuthController {
  constructor(readonly service: AuthService) {
    this.service = service
  }

  // sign-in
  @Post('login')
  @ApiBody({ type: SignInDto })
  @ApiCreatedResponse({ type: SignInDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found user' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  signIn(@Body() body: SignInDto) {
    return this.service.signIn(body)
  }

  // refresh
  @Post('refresh')
  @ApiBody({ type: RefreshDto })
  @ApiBearerAuth()
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found user' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  refresh(@Body() body: RefreshDto) {
    return this.service.refresh(body.refreshToken)
  }
}

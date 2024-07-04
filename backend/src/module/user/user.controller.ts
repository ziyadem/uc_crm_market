import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { UserCreateDto } from './dtos'
import { UserService } from './user.service'
import { CurrentUserJoin } from '@decorators'
import { ParseUUIDPipe } from '@nestjs/common'
import { SupperAdminAuthorizationGuard } from '@guard'
import { UserUpdateDto } from './dtos/user-update.dto'
import { AdminSupperAdminAuthorizationGuard } from 'guard/adminSuperAdmin-authorization.guard'

@ApiTags('User')
@ApiBearerAuth()
@Controller({
  path: 'user/',
  version: '1',
})
export class UserController {
  constructor(readonly service: UserService) {
    this.service = service
  }

  // get All
  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(SupperAdminAuthorizationGuard)
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAll() {
    return this.service.getAll()
  }

  // create
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(AdminSupperAdminAuthorizationGuard)
  @ApiBody({ type: UserCreateDto })
  @ApiCreatedResponse({ type: UserCreateDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(@Body() body: UserCreateDto, @CurrentUserJoin() user: any) {
    if (user.role === 'super admin') {
      return this.service.create(body, 'admin')
    }
    if (user.role === 'admin') {
      return this.service.create(body, 'kassir')
    }
  }

  // update
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  @UseGuards(SupperAdminAuthorizationGuard)
  @ApiBody({ type: UserUpdateDto })
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'company Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UserUpdateDto,
  ): Promise<void> {
    await this.service.update({ ...body, id })
  }

  // delete
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(SupperAdminAuthorizationGuard)
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'company Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id)
  }
}

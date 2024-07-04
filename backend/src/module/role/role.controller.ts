import {
  Get,
  Post,
  Body,
  HttpCode,
  Controller,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiBody,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { RoleService } from './role.service'
import { RoleCreateDto } from './dtos'

@ApiTags('Role')
@Controller({
  path: '/role/',
  version: '0.0.1',
})
export class RoleController {
  constructor(readonly service: RoleService) {
    this.service = service
  }

  // get All
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 'fa4cc3b6-a58b-4a6c-9f01-ba35f188b552',
          name: 'role',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAll() {
    return this.service.getAll()
  }

  // create
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBody({ type: RoleCreateDto })
  @ApiCreatedResponse({ type: RoleCreateDto })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() body: RoleCreateDto) {
    await this.service.create(body)
  }
}

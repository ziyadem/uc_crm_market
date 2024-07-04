import {
  Get,
  Body,
  Post,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { IsUuidPipe } from '@validators'
import { CurrentUserJoin } from '@decorators'
import { CategoryService } from './category.service'
import { CategoryCreateDto, CategoryUpdateDto } from './dtos'
import { AdminAuthorizationGuard, AuthorizationGuard } from '@guard'

@ApiTags('Category')
@Controller({
  path: '/category/',
  version: '0.0.1',
})
@ApiBearerAuth()
export class CategoryController {
  constructor(readonly service: CategoryService) {
    this.service = service
  }

  // get
  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthorizationGuard)
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 'fa4cc3b6-a58b-4a6c-9f01-ba35f188b552',
          title: 'fruits',
          status: true,
          createdAt: '2023-08-12T14:47:00.000Z',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAll(@CurrentUserJoin() user: any) {
    console.log(user, 'u')

    if (user.role === 'admin') {
      return this.service.getAll(user.companyId)
    }
    if (user.role === 'kassir') {
      return this.service.getActive(user.companyId)
    }
  }

  // get one
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(AuthorizationGuard)
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 'fa4cc3b6-a58b-4a6c-9f01-ba35f188b552',
          title: 'fruits',
          status: true,
          createdAt: '2023-08-12T14:47:00.000Z',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getOne(@CurrentUserJoin() user: any, @Param('id', IsUuidPipe) id: string) {
    return this.service.getOne(id, user.companyId)
  }

  // create
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminAuthorizationGuard)
  @Post()
  @ApiBody({ type: CategoryCreateDto })
  @ApiCreatedResponse({ type: CategoryCreateDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() body: CategoryCreateDto, @CurrentUserJoin() user: any) {
    await this.service.create({ ...body, company_id: user.companyId })
  }

  // update
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  @UseGuards(AdminAuthorizationGuard)
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'company Not Found' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ type: CategoryUpdateDto })
  async update(
    @Param('id', IsUuidPipe) id: string,
    @Body() body: CategoryUpdateDto,
    @CurrentUserJoin() user: any,
  ): Promise<void> {
    await this.service.update({
      ...body,
      id,
      company_id: user.companyId,
    })
  }

  // delete
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(AdminAuthorizationGuard)
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'company Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserJoin() user: any,
  ): Promise<void> {
    await this.service.delete(id, user.company_id)
  }
}

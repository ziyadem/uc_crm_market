import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import {
  AuthorizationGuard,
  AdminAuthorizationGuard,
  EmployeeAuthorizationGuard,
} from '@guard'
import { IsUuidPipe } from '@validators'
import { CurrentUserJoin } from '@decorators'
import { ProductService } from './product.service'
import { ProductCreateDto, ProductUpdateDto } from './dtos'

@ApiTags('Product')
@Controller({
  path: '/product/',
  version: '0.0.1',
})
@ApiBearerAuth()
export class ProductController {
  constructor(readonly service: ProductService) {
    this.service = service
  }

  // get all
  @HttpCode(HttpStatus.OK)
  @Get('all/:category_id')
  @UseGuards(AuthorizationGuard)
  @ApiParam({
    name: 'category_id',
    example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419',
  })
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
  getActive(
    @Param('category_id', ParseUUIDPipe) category_id: string,
    @CurrentUserJoin() user: any,
  ) {
    if (user.role === 'admin') {
      return this.service.getAll(user.companyId, category_id)
    }
    if (user.role === 'kassir') {
      return this.service.getActive(user.companyId, category_id)
    }
  }

  // get one
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(EmployeeAuthorizationGuard)
  @ApiParam({
    name: 'id',
    example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419',
  })
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
  getOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUserJoin() user: any) {
    return this.service.getOne(id, user.companyId)
  }

  // create
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminAuthorizationGuard)
  @Post()
  @ApiBody({ type: ProductCreateDto })
  @ApiCreatedResponse({ type: ProductCreateDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() body: ProductCreateDto, @CurrentUserJoin() user: any) {
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
  @ApiBody({ type: ProductUpdateDto })
  async update(
    @Param('id', IsUuidPipe) id: string,
    @Body() body: ProductUpdateDto,
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
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(AdminAuthorizationGuard)
  @ApiNotFoundResponse({ description: 'company Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserJoin() user: any,
  ): Promise<void> {
    console.log(user)
    await this.service.delete(user.companyId, id)
  }
}

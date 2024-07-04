import {
  Get,
  Post,
  Body,
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
  ApiBody,
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import {
  AuthorizationGuard,
  AdminAuthorizationGuard,
  EmployeeAuthorizationGuard,
} from '@guard'
import { SaleService } from './sale.service'
import { CurrentUserJoin } from '@decorators'
import { SaleCreateDto } from './dtos/sale-create.dto'

@ApiTags('Sale')
@Controller({
  path: '/sale/',
  version: '0.0.1',
})
@ApiBearerAuth()
export class SaleController {
  constructor(readonly service: SaleService) {
    this.service = service
  }

  // get all
  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthorizationGuard)
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAllAdminSale(@CurrentUserJoin() user: any) {
    if (user.role === 'admin') {
      return this.service.getAll(user.companyId)
    }
    if (user.role === 'kassir') {
      return this.service.getEmployeeAll(user.id)
    }
  }

  // get one
  @HttpCode(HttpStatus.OK)
  @Get('one/:id')
  @UseGuards(AuthorizationGuard)
  @ApiParam({
    name: 'id',
    example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getOne(@CurrentUserJoin() user: any, @Param('id', ParseUUIDPipe) id: string) {
    if (user.role === 'kassir') {
      return this.service.getOne(id, user.id)
    }
    if (user.role === 'admin') {
      return this.service.getOneAdmin(id)
    }
  }

  // create
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(EmployeeAuthorizationGuard)
  @Post()
  @ApiBody({ type: SaleCreateDto })
  @ApiCreatedResponse({ type: SaleCreateDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiUnauthorizedResponse({ description: 'unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() body: SaleCreateDto, @CurrentUserJoin() user: any) {
    await this.service.create({
      ...body,
      company_id: user.companyId,
      employee_id: user.id,
    })
  }

  // returns
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(EmployeeAuthorizationGuard)
  @ApiNotFoundResponse({ description: 'sale Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async returns(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserJoin() user: any,
  ): Promise<void> {
    await this.service.returns(user.employeId, id)
  }

  // delete
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(AdminAuthorizationGuard)
  @ApiNotFoundResponse({ description: 'Sale Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id)
  }
}

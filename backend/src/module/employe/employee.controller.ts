import {
  Get,
  Body,
  Post,
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
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { IsUuidPipe } from '@validators'
import { CurrentUserJoin } from '@decorators'
import { EmployeeService } from './employee.service'
import { EmployeeCreateDto, EmployeeUpdateDto } from './dtos'
import { AdminAuthorizationGuard, AuthorizationGuard } from '@guard'

@ApiTags('Employee')
@ApiBearerAuth()
@Controller({
  path: '/employee/',
  version: '0.0.1',
})
export class EmployeeController {
  constructor(readonly service: EmployeeService) {
    this.service = service
  }

  // get All
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: '2137d294-e40c-4309-9021-1b917b490feb',
          username: 'Asad',
          fname: 'Shuhratov',
          lname: 'Asadbek',
          password: 'asad123',
          phone: '998999110117',
          email: 'asadbek@gmail.com',
          roleId: 'f9beb962-f005-409f-8807-58ca24141525',
          IsAvailable: true,
          companyId: '198e21ac-280b-43f0-a5ee-b5e54ba74131',
          createdAt: '2023-08-20T15:11:51.000Z',
          updatedAt: '2023-08-20T15:11:51.000Z',
        },
      ],
    },
  })
  @UseGuards(AuthorizationGuard)
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getAll(@CurrentUserJoin() user: any) {
    console.log(user, 'user')
    if (user.role === 'admin') {
      return this.service.getAll(user.companyId)
    }
    if (user.role === 'kassir') {
      return this.service.getOne(user.id, user.companyId)
    }
  }

  // get One
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOkResponse({
    schema: {
      example: {
        id: '2137d294-e40c-4309-9021-1b917b490feb',
        username: 'Asad',
        fname: 'Shuhratov',
        lname: 'Asadbek',
        password: 'asad123',
        phone: '998999110117',
        email: 'asadbek@gmail.com',
        roleId: 'f9beb962-f005-409f-8807-58ca24141525',
        IsAvailable: true,
        companyId: '198e21ac-280b-43f0-a5ee-b5e54ba74131',
        createdAt: '2023-08-20T15:11:51.000Z',
        updatedAt: '2023-08-20T15:11:51.000Z',
      },
    },
  })
  @UseGuards(AdminAuthorizationGuard)
  @ApiParam({ name: 'id', example: '198e21ac-280b-43f0-a5ee-b5e54ba74131' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getOne(@CurrentUserJoin() user: any, @Param('id', IsUuidPipe) id: string) {
    return this.service.getOne(id, user.companyId)
  }

  // create
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBody({ type: EmployeeCreateDto })
  @UseGuards(AdminAuthorizationGuard)
  @ApiCreatedResponse({ type: EmployeeCreateDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() body: EmployeeCreateDto, @CurrentUserJoin() user: any) {
    await this.service.create({ ...body, company_id: user.companyId })
  }

  // update
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  @UseGuards(AdminAuthorizationGuard)
  @ApiParam({ name: 'id', example: '198e21ac-280b-43f0-a5ee-b5e54ba74131' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ type: EmployeeUpdateDto })
  async update(
    @Param('id', IsUuidPipe) id: string,
    @Body() body: EmployeeUpdateDto,
  ): Promise<void> {
    await this.service.update({
      ...body,
      id,
    })
  }

  // delete
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(AdminAuthorizationGuard)
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'employee Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(
    @CurrentUserJoin() user: any,
    @Param('id', IsUuidPipe) id: string,
  ): Promise<void> {
    await this.service.delete(id)
  }
}

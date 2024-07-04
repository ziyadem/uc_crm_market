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
  ApiBody,
  ApiTags,
  ApiParam,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { IsUuidPipe } from '@validators'
import { CompanyService } from './company.service'
import { SupperAdminAuthorizationGuard } from '@guard'
import { CompanyCreateDto, CompanyUpdateDto } from './dtos'

@ApiTags('Company')
@Controller({
  path: '/',
  version: '0.0.1',
})
@ApiBearerAuth()
export class CompanyController {
  constructor(readonly service: CompanyService) {
    this.service = service
  }

  // get All
  @HttpCode(HttpStatus.OK)
  @Get('company-user')
  @UseGuards(SupperAdminAuthorizationGuard)
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 'fa4cc3b6-a58b-4a6c-9f01-ba35f188b552',
          name: 'UC Coding',
          status: true,
          createdAt: '2023-08-12T14:47:00.000Z',
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
  @Post('company')
  @ApiBody({ type: CompanyCreateDto })
  @ApiCreatedResponse({ type: CompanyCreateDto })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async create(@Body() body: CompanyCreateDto) {
    await this.service.create(body)
  }

  // update
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('company/:id')
  @ApiParam({ name: 'id', example: '198e21ac-280b-43f0-a5ee-b5e54ba74131' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'company Not Found' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({ type: CompanyUpdateDto })
  async update(
    @Param('id', IsUuidPipe) id: string,
    @Body() body: CompanyUpdateDto,
  ): Promise<void> {
    await this.service.update({
      ...body,
      id,
    })
  }

  // delete
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('company/:id')
  @ApiParam({ name: 'id', example: 'e6fb9ee2-6f5d-46bb-8b04-3b4a9b716419' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'company Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id)
  }
}

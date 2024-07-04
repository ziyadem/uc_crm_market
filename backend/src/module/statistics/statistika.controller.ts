import {
  Get,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { AuthorizationGuard } from '@guard'
import { CurrentUserJoin } from '@decorators'
import { StatistikaService } from './statistika.service'

@ApiTags('Statistics')
@Controller({
  path: '/statistiks/',
  version: '0.0.1',
})
@ApiBearerAuth()
export class StatistikaController {
  constructor(readonly service: StatistikaService) {
    this.service = service
  }

  // get all
  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthorizationGuard)
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 'fa4cc3b6-a58b-4a6c-9f01-ba35f188b552',
          title: 'fruits',
          count: 1,
          createdAt: '2023-08-12T14:47:00.000Z',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getEmployee(@CurrentUserJoin() user: any) {
    if (user.role === 'admin') {
      return this.service.getAdmin(user.companyId)
    }
    if (user.role === 'kassir') {
      return this.service.getEmployee(user.id)
    }
  }
}

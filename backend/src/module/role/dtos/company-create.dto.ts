import { IsNotEmpty, IsString } from 'class-validator'
import { RoleCreateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class RoleCreateDto implements RoleCreateRequest {
  @ApiProperty({ example: 'super admin' })
  @IsString()
  @IsNotEmpty()
  name: string
}

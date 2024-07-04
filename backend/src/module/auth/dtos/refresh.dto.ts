import { IsNotEmpty, IsString } from 'class-validator'
import { RefreshRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshDto implements RefreshRequest {
  @ApiProperty({ example: 'acdhboufvoiqurpuqpiuhrpiuqehfvipuhqp' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}

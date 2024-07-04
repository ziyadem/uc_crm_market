import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { UserCreateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class UserCreateDto implements UserCreateRequest {
  @ApiProperty({ example: 'ziyadem' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string

  @ApiProperty({ example: 'ziyadem123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @ApiProperty({ example: '5359005467' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  telegramId?: string
}

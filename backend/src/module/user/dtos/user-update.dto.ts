import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Length,
} from 'class-validator'
import { UserUpdateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class UserUpdateDto implements UserUpdateRequest {
  @ApiProperty({ example: 'Ziyoda' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  username?: string

  @ApiProperty({ example: 'ziyadem123' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(6)
  password?: string

  @ApiProperty({ example: '5359005467' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(10)
  telegramId?: string
}

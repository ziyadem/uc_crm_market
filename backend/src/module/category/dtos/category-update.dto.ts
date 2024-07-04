import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator'
import { CategoryUpdateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class CategoryUpdateDto implements CategoryUpdateRequest {
  @ApiProperty({ example: 'fruits' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  title?: string

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  IsAvailable?: boolean
}

import {
  IsNumber,
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ProductUpdateRequest } from '../interfaces'

export class ProductUpdateDto implements ProductUpdateRequest {
  @ApiProperty({ example: 'fruits' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  title?: string

  @ApiProperty({ example: 9000 })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  IsAvailable?: boolean
}

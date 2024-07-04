import {
  IsUUID,
  IsNumber,
  IsString,
  IsBoolean,
  MinLength,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ProductCreateRequest } from '../interfaces'

export class ProductCreateDto implements ProductCreateRequest {
  @ApiProperty({ example: 'fa4cc3b6-a58b-4a6c-9f01-ba35f188b552' })
  @IsUUID()
  @IsNotEmpty()
  category_id: string

  @ApiProperty({ example: 'fruits' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string

  @ApiProperty({ example: 9000 })
  @IsNumber()
  @IsNotEmpty()
  price: number

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean
}

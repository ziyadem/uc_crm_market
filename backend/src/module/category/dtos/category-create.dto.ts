import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { CategoryCreateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class CategoryCreateDto implements CategoryCreateRequest {
  @ApiProperty({ example: 'fruits' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  IsAvailable: boolean
}

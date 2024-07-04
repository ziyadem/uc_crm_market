import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'
import { CompanyUpdateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class CompanyUpdateDto implements CompanyUpdateRequest {
  @ApiProperty({ example: 'karzinka' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  IsActive?: boolean
}

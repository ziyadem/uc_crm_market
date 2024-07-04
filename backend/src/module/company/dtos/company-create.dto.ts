import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { CompanyCreateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class CompanyCreateDto implements CompanyCreateRequest {
  @ApiProperty({ example: 'Karzinka' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  IsActive: boolean

  @ApiProperty({ example: 'fa4cc3b6-a58b-4a6c-9f01-ba35f188b552' })
  @IsUUID()
  @IsNotEmpty()
  admin_id: string
}

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  Length,
} from 'class-validator'
import { EmployeeUpdateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'
import {} from 'class-validator'

export class EmployeeUpdateDto implements EmployeeUpdateRequest {
  @ApiProperty({ example: 'asad' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  username: string

  @ApiProperty({ example: 'Shuhratov' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  fname?: string

  @ApiProperty({ example: 'Asadbek' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3)
  lname?: string

  @ApiProperty({ example: 'asadbek@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string

  @ApiProperty({ example: '998999110117' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Length(12)
  phone?: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  IsAvailable?: boolean

  @ApiProperty({ example: 'asad123' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(6)
  password?: string
}

import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator'
import { EmployeeCreateRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class EmployeeCreateDto implements EmployeeCreateRequest {
  @ApiProperty({ example: 'asad' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string

  @ApiProperty({ example: 'Shuhratov' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fname: string

  @ApiProperty({ example: 'Asadbek' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  lname: string

  @ApiProperty({ example: 'asadbek@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: '998999110117' })
  @IsString()
  @IsNotEmpty()
  @Length(12)
  phone: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  IsAvailable: boolean

  @ApiProperty({ example: 'asad123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}

import { IsNotEmpty, IsString } from 'class-validator'
import { SignInRequest } from '../interfaces'
import { ApiProperty } from '@nestjs/swagger'

export class SignInDto implements SignInRequest {
  @ApiProperty({ example: 'ziyadem' })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ example: 'ziyadem123' })
  @IsString()
  @IsNotEmpty()
  password: string
}

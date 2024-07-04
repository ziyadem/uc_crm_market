import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsNotEmpty, IsArray, IsUUID } from 'class-validator'
import { Payment } from '../enum'
import { Sale, SaleCreateRequest } from '../interfaces'

export class SaleDto implements Sale {
  @ApiProperty({ example: 9000 })
  @IsNumber()
  @IsNotEmpty()
  count: number

  @ApiProperty({ example: '61c7e8f1-db2b-4784-aee7-03a32bcec6d0' })
  @IsUUID()
  @IsNotEmpty()
  product_id: string

  constructor(payload: SaleDto) {
    this.count = payload.count
    this.product_id = payload.product_id
  }
}

export class SaleCreateDto implements SaleCreateRequest {
  @ApiProperty({ example: 9000 })
  @IsNumber()
  @IsNotEmpty()
  priceAll: number

  @ApiProperty({ example: Payment })
  @IsEnum(Payment)
  @IsNotEmpty()
  payment: Payment

  @ApiProperty({ type: [SaleDto] })
  @IsArray()
  @IsNotEmpty()
  sales: SaleDto[]

  @ApiProperty({ example: 12000 })
  @IsNumber()
  @IsNotEmpty()
  priceCash: number

  @ApiProperty({ example: 13000 })
  @IsNumber()
  @IsNotEmpty()
  pricePlastic: number
}

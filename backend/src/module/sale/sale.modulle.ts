import { Module } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { SaleService } from './sale.service'
import { SaleController } from './sale.controller'

@Module({
  providers: [PrismaService, SaleService],
  controllers: [SaleController],
})
export class SaleModulle {}

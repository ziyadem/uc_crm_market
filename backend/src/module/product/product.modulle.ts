import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { Module } from '@nestjs/common'
import { PrismaService } from '@prisma'

@Module({
  providers: [PrismaService, ProductService],
  controllers: [ProductController],
})
export class ProductModulle {}

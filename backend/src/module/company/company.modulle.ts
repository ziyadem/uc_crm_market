import { Module } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { CompanyService } from './company.service'
import { CompanyController } from './company.controller'

@Module({
  providers: [PrismaService, CompanyService],
  controllers: [CompanyController],
})
export class CompanyModulle {}

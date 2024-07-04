import { Module } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { EmployeeService } from './employee.service'
import { EmployeeController } from './employee.controller'

@Module({
  providers: [PrismaService, EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModulle {}

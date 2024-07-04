import {
  RoleModulle,
  AuthModulle,
  UserModulle,
  SaleModulle,
  CompanyModulle,
  ProductModulle,
  CategoryModulle,
  EmployeeModulle,
  StatistikaModulle,
} from '@module'
import { dbConfig } from './config'
import { TasksService } from 'service'
import { PrismaService } from '@prisma'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    RoleModulle,
    AuthModulle,
    UserModulle,
    SaleModulle,
    ProductModulle,
    CompanyModulle,
    EmployeeModulle,
    CategoryModulle,
    StatistikaModulle,
  ],
  providers: [PrismaService, TasksService],
})

export class App {}

import { Module } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { StatistikaService } from './statistika.service'
import { StatistikaController } from './statistika.controller'

@Module({
  providers: [PrismaService, StatistikaService],
  controllers: [StatistikaController],
})
export class StatistikaModulle {}

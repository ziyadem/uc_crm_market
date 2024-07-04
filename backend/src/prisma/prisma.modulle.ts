import { PrismaService } from './prisma.service'
import { Module } from '@nestjs/common'

@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}

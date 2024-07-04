import { Module } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'

@Module({
  providers: [PrismaService, RoleService],
  controllers: [RoleController],
})
export class RoleModulle {}

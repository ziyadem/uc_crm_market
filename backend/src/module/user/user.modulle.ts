import { Module } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  providers: [PrismaService, UserService],
  controllers: [UserController],
})
export class UserModulle {}

import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import { UserCreateRequest, UserUpdateRequest } from './interfaces'
import { PrismaService } from '@prisma'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  // get All
  async getAll() {
    try {
      return this.#_prisma.user.findMany({
        where: {
          role: {
            name: 'admin',
          },
        },
        select: {
          id: true,
          username: true,
          telegramId: true,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // create
  async create(payload: UserCreateRequest, role: string) {
    await this.#_foundedUser(payload.username)
    try {
      const roleId = await this.#_prisma.role.findFirst({
        where: {
          name: role,
        },
        select: {
          id: true,
        },
      })

      const password = await bcrypt.hash(payload.password, 12)

      await this.#_prisma.user.create({
        data: {
          username: payload.username,
          password,
          roleId: roleId.id,
          telegramId: payload.telegramId,
        },
      })
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException()
    }
  }

  // update
  async update(payload: UserUpdateRequest) {
    await this.#_foundedUserId(payload.id)
    try {
      const password = await bcrypt.hash(payload.password, 12)
      await this.#_prisma.user.update({
        where: {
          id: payload.id,
        },
        data: {
          username: payload.username,
          password,
          telegramId: payload.telegramId,
        },
      })
    } catch (error) {
      throw new ConflictException('user alredy exists')
    }
  }

  // delete
  async delete(id: string) {
    const user = await this.#_prisma.user.findFirst({
      where: {
        id: id,
      },
    })
    if (!user) {
      throw new NotFoundException('user not found')
    }
    try {
      await this.#_prisma.user.deleteMany({
        where: {
          id: id,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async #_foundedUser(username: string) {
    const user = await this.#_prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        password: true,
      },
    })
    if (user) {
      throw new ConflictException('user already exists')
    }
  }

  async #_foundedUserId(id: string) {
    const user = await this.#_prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    })
    if (!user) {
      throw new NotFoundException('user not found')
    }
  }
}

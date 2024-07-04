import { PrismaService } from '@prisma'
import { Injectable, ConflictException } from '@nestjs/common'
import { RoleCreateRequest } from './interfaces'

@Injectable()
export class RoleService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  //get all
  async getAll() {
    return this.#_prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    })
  }

  // create
  async create(payload: RoleCreateRequest) {
    await this.#_checkRole(payload.name)

    await this.#_prisma.role.create({
      data: {
        name: payload.name,
      },
    })
  }

  // check roke
  async #_checkRole(name: string) {
    const role = await this.#_prisma.role.findFirst({
      where: {
        name: name,
      },
    })
    if (role) {
      throw new ConflictException('role already exists')
    }
  }
}

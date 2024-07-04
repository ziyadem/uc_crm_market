import { PrismaService } from '@prisma'
import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { CompanyCreateRequest, CompanyUpdateRequest } from './interfaces'

@Injectable()
export class CompanyService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  //get all
  async getAll() {
    const companys = await this.#_prisma.company.findMany({
      select: {
        id: true,
        name: true,
        IsActive: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })
    const users = await this.#_prisma.user.findMany({
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
    return { users, companys }
  }

  //get one
  async getOne(id: string) {
    await this.#_foundedCompany(id)
    return this.#_prisma.company.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        IsActive: true,
        createdAt: true,
      },
    })
  }

  // create
  async create(payload: CompanyCreateRequest) {
    await this.#_checkCompany(payload.name)
    await this.#_checkAdmin(payload.admin_id)

    try {
      await this.#_prisma.company.create({
        data: {
          name: payload.name,
          IsActive: payload.IsActive,
          adminId: payload.admin_id,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException('error')
    }
  }

  //update
  async update(payload: CompanyUpdateRequest): Promise<void> {
    await this.#_foundedCompany(payload.id)
    try {
      await this.#_prisma.company.update({
        where: {
          id: payload.id,
        },
        data: {
          name: payload.name,
          IsActive: payload.IsActive,
        },
      })
    } catch (error) {
      throw new ConflictException('company already exists')
    }
  }

  // delete
  async delete(id: string) {
    await this.#_foundedCompany(id)
    await this.#_prisma.company.deleteMany({
      where: {
        id: id,
      },
    })
  }

  async #_checkCompany(name: string) {
    const company = await this.#_prisma.company.findFirst({
      where: {
        name: name,
      },
    })

    if (company) {
      throw new ConflictException('company already exists')
    }
  }

  async #_checkAdmin(id: string) {
    const admin = await this.#_prisma.user.findFirst({
      where: {
        id: id,
        role: {
          name: 'admin',
        },
      },
    })

    if (!admin) {
      throw new NotFoundException('user not found')
    }
  }

  async #_foundedCompany(id: string) {
    const company = await this.#_prisma.company.findFirst({
      where: {
        id: id,
      },
    })

    if (!company) {
      throw new NotFoundException('company not found')
    }
  }
}

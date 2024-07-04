import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from '@prisma'
import { CategoryCreateRequest, CategoryUpdateRequest } from './interfaces'

@Injectable()
export class CategoryService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  //get all
  async getAll(company_id: string) {
    try {
      const res = []
      const products = await this.#_prisma.category.findMany({
        where: {
          companyId: company_id,
        },
        select: {
          id: true,
          title: true,
          IsAvailable: true,
          product: {
            select: {
              id: true,
            },
          },
        },
      })
      products.forEach((p) => {
        const obj = {
          id: p.id,
          title: p.title,
          IsAvailable: p.IsAvailable,
          product_count: p.product.length,
        }
        res.push(obj)
      })
      return res
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  //get active
  async getActive(company_id: string) {
    try {
      const res = []
      const products = await this.#_prisma.category.findMany({
        where: {
          companyId: company_id,
          IsAvailable: true,
        },
        select: {
          id: true,
          title: true,
          IsAvailable: true,
          product: {
            select: {
              id: true,
            },
          },
        },
      })
      products.forEach((p) => {
        const obj = {
          id: p.id,
          title: p.title,
          IsAvailable: p.IsAvailable,
          product_count: p.product.length,
        }
        res.push(obj)
      })
      return res
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  //get
  async getOne(id: string, company_id: string) {
    try {
      const category = await this.#_prisma.category.findFirst({
        where: {
          id: id,
          companyId: company_id,
        },
      })

      if (!category) {
        return new NotFoundException('category not found')
      }
      return category
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // create
  async create(payload: CategoryCreateRequest) {
    await this.#_checkCategory(payload.title, payload.company_id)
    try {
      await this.#_prisma.category.create({
        data: {
          title: payload.title,
          IsAvailable: payload.IsAvailable,
          companyId: payload.company_id,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  //update
  async update(payload: CategoryUpdateRequest): Promise<void> {
    await this.#_foundedCategory(payload.id, payload.company_id)
    try {
      await this.#_prisma.category.updateMany({
        where: {
          id: payload.id,
          companyId: payload.company_id,
        },
        data: {
          title: payload.title,
          IsAvailable: payload.IsAvailable,
        },
      })
    } catch (error) {
      throw new ConflictException('category already exists')
    }
  }

  // delete
  async delete(id: string, company_id: string) {
    await this.#_foundedCategory(id, company_id)
    try {
      await this.#_prisma.category.deleteMany({
        where: {
          id: id,
          companyId: company_id,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async #_checkCategory(title: string, company_id: string) {
    const category = await this.#_prisma.category.findMany({
      where: {
        title: title,
        companyId: company_id,
      },
    })

    if (category.length !== 0) {
      throw new ConflictException('category already exists')
    }
  }

  async #_foundedCategory(id: string, company_id: string) {
    const category = await this.#_prisma.category.findFirst({
      where: {
        id: id,
        companyId: company_id,
      },
    })

    if (!category) {
      throw new NotFoundException('category not found')
    }
  }
}

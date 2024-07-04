import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { ProductCreateRequest, ProductUpdateRequest } from './interfaces'
import { PrismaService } from '@prisma'
import { InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class ProductService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  //get all
  async getAll(company_id: string, category_id: string) {
    await this.#_foundedCategory(category_id, company_id)
    try {
      const product = await this.#_prisma.category.findMany({
        where: {
          id: category_id,
          companyId: company_id,
          IsAvailable: true,
        },
        select: {
          product: {
            select: {
              id: true,
              price: true,
              title: true,
              createdAt: true,
              IsAvailable: true,
            },
          },
        },
      })
      if (product[0].product) {
        return product[0].product
      } else {
        return product
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  //get active
  async getActive(company_id: string, category_id: string) {
    await this.#_foundedCategory(category_id, company_id)
    try {
      const product = await this.#_prisma.category.findMany({
        where: {
          id: category_id,
          companyId: company_id,
          IsAvailable: true,
        },
        select: {
          product: {
            where: {
              IsAvailable: true,
            },
          },
        },
      })
      return product[0].product
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  //get one
  async getOne(id: string, companyId: string) {
    try {
      const product = await this.#_prisma.product.findFirst({
        where: {
          id: id,
          IsAvailable: true,
          category: {
            companyId: companyId,
          },
        },
        select: {
          id: true,
          title: true,
          price: true,
        },
      })
      if (!product) {
        return new NotFoundException('Product not found')
      }
      return product
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // create
  async create(payload: ProductCreateRequest) {
    await this.#_foundedCategory(payload.category_id, payload.company_id)
    await this.#_checkProduct(payload.title, payload.category_id)
    try {
      await this.#_prisma.product.create({
        data: {
          title: payload.title,
          IsAvailable: payload.isAvailable,
          price: payload.price,
          categoryId: payload.category_id,
        },
      })
    } catch (error) {
      throw new NotFoundException('categories not found')
    }
  }

  //update
  async update(payload: ProductUpdateRequest): Promise<void> {
    await this.#_foundedProductId(payload.id, payload.company_id)
    try {
      await this.#_prisma.product.updateMany({
        where: {
          id: payload.id,
          category: {
            companyId: payload.company_id,
          },
        },
        data: {
          title: payload.title,
          IsAvailable: payload.IsAvailable,
          price: payload.price,
        },
      })
    } catch (error) {
      throw new ConflictException('product already exists')
    }
  }

  // delete
  async delete(company_id: string, id: string) {
    await this.#_foundedProductId(id, company_id)
    await this.#_prisma.product.deleteMany({
      where: {
        id: id,
        category: {
          companyId: company_id,
        },
      },
    })
  }

  async #_checkProduct(title: string, category_id: string) {
    const product = await this.#_prisma.product.findMany({
      where: {
        title: title,
        categoryId: category_id,
      },
    })

    if (product.length !== 0) {
      throw new ConflictException('product already exists')
    }
  }

  async #_foundedCategory(id: string, company_id: string) {
    const category = await this.#_prisma.category.findMany({
      where: {
        id: id,
        companyId: company_id,
        IsAvailable: true,
      },
    })

    if (category.length == 0) {
      throw new NotFoundException('category not found')
    }
  }

  async #_foundedProductId(id: string, company_id: string) {
    const product = await this.#_prisma.product.findFirst({
      where: {
        id: id,
        category: {
          companyId: company_id,
        },
      },
    })

    if (!product) {
      throw new NotFoundException('product not found')
    }
  }
}

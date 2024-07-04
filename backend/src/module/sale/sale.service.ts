import { PrismaService } from '@prisma'
import { SaleCreateRequest } from './interfaces'
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'

@Injectable()
export class SaleService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  //get all
  async getAll(company_id: string) {
    try {
      return this.#_prisma.mainSale.findMany({
        where: {
          employee: {
            companyId: company_id,
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  //get employe sale
  async getEmployeeAll(employee_id: string) {
    try {
      return await this.#_prisma.mainSale.findMany({
        where: {
          employeeId: employee_id,
          deletedAt: null,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  //get one
  async getOne(id: string, employeId: string) {
    try {
      const user = await this.#_prisma.employee.findFirst({
        where: {
          id: employeId,
        },
        select: {
          username: true,
          fname: true,
          lname: true,
          company: {
            select: {
              name: true,
            },
          },
        },
      })
      const sale = await this.#_prisma.mainSale.findMany({
        where: {
          id: id,
        },
        select: {
          id: true,
          priceAll: true,
          priceCash: true,
          pricePlastic: true,
          payment: true,
          createdAt: true,
          sale: {
            select: {
              count: true,
              product: {
                select: {
                  title: true,
                  price: true,
                },
              },
            },
          },
        },
      })
      // if (res.length==0) {
      //   throw new NotFoundException('sale not found')
      // }
      console.log(user, sale, 'kj')
      return {
        company: user.company.name,
        kassir: user.fname + ' ' + user.lname,
        userName: user.username,
        ...sale[0],
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
  //get one
  async getOneAdmin(id: string) {
    try {
      const user = await this.#_prisma.mainSale.findMany({
        where: {
          id: id,
        },
        select: {
          employee: {
            select: {
              username: true,
              fname: true,
              lname: true,
              company: {
                select: {
                  name: true,
                },
              },
            },
          },
          createdAt: true,
          employeeId: true,
          priceAll: true,
          priceCash: true,
          pricePlastic: true,
          sale: {
            select: {
              count: true,
              product: {
                select: {
                  title: true,
                  price: true,
                },
              },
            },
          },
        },
      })

      return {
        id,
        company: user[0].employee.company.name,
        kassir: user[0].employee.fname + ' ' + user[0].employee.lname,
        userName: user[0].employee.username,
        priceAll: user[0].priceAll,
        priceCash: user[0].priceCash,
        pricePlastic: user[0].pricePlastic,
        createdAt: user[0].createdAt,
        sale: user[0].sale,
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // create
  async create(payload: SaleCreateRequest) {
    const sale = payload.sales
    for (let i = 0; i < sale.length; i++) {
      await this.#_foundedProductId(sale[i].product_id, payload.company_id)
    }

    try {
      const obj = await this.#_prisma.mainSale.create({
        data: {
          employeeId: payload.employee_id,
          priceAll: payload.priceAll,
          payment: payload.payment,
          priceCash: payload.priceCash,
          pricePlastic: payload.pricePlastic,
          saleNum: 1,
        },
        select: {
          id: true,
        },
      })

      for (let i = 0; i < sale.length; i++) {
        await this.#_prisma.sale.create({
          data: {
            productId: sale[i].product_id,
            employeeId: payload.employee_id,
            count: sale[i].count,
            mainSaleId: obj.id,
          },
        })
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // returns
  async returns(employe_id: string, id: string) {
    try {
      const day = new Date()
      const res = await this.#_prisma.mainSale.findFirst({
        where: {
          id,
          employeeId: employe_id,
        },
      })
      if (!res) {
        return new NotFoundException(`Not found `)
      }
      await this.#_prisma.mainSale.updateMany({
        where: {
          id,
          employeeId: employe_id,
        },
        data: {
          deletedAt: day,
        },
      })
      await this.#_prisma.sale.updateMany({
        where: {
          mainSaleId: id,
          employeeId: employe_id,
        },
        data: {
          deletedAt: day,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // delete
  async delete(id: string) {
    await this.#_foundedSale(id)
    try {
      await this.#_prisma.mainSale.deleteMany({
        where: {
          id,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async #_foundedProductId(id: string, company_id: string) {
    try {
      const product = await this.#_prisma.product.findFirst({
        where: {
          id,
          category: {
            companyId: company_id,
          },
        },
      })
      if (!product) {
        throw new NotFoundException('product not found')
      }
    } catch (error) {
      throw new NotFoundException('product not found')
    }
  }

  async #_foundedSale(id: string) {
    const sale = await this.#_prisma.mainSale.findFirst({
      where: {
        id,
      },
    })
    console.log(sale)

    if (!sale) {
      throw new NotFoundException('sale not found')
    }
  }
}

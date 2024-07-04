import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '@prisma'

@Injectable()
export class StatistikaService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  //get admin
  async getAdmin(company_id: string) {
    try {
      const products = await this.#_prisma.product.findMany({
        where: {
          category: {
            companyId: company_id,
          },
        },
        select: {
          price: true,
          title: true,
          sale: {
            select: {
              count: true,
              deletedAt: true,
              mainSale: {
                select: {
                  payment: true,
                  priceCash: true,
                  pricePlastic: true,
                },
              },
            },
          },
        },
      })
      const summ = await this.#_prisma.employee.findMany({
        where: {
          companyId: company_id,
        },
        select: {
          mainSale: {
            select: {
              payment: true,
              priceCash: true,
              pricePlastic: true,
              deletedAt: true,
            },
          },
        },
      })

      const res = { cash: 0, plastic: 0, returns: 0, product: [] }
      summ.forEach((s) => {
        const sum = s.mainSale
        sum.forEach((s) => {
          if (!s.deletedAt) {
            res.cash += s.priceCash
            res.plastic += s.pricePlastic
          } else {
            res.returns += s.priceCash + s.pricePlastic
          }
        })
      })

      products.forEach((p) => {
        const obj = {
          'Product Title': p.title,
          'Product Price': p.price,
          'Sold Price': 0,
          'Sold Count': 0,
          'Return Price': 0,
          'Return Count': 0,
          'Total Price': 0,
        }
        p.sale.forEach((c) => {
          if (!c.deletedAt) {
            obj['Product Price'] += c?.count
            obj['Sold Price'] += c?.count * p.price
            obj['Total Price'] += c?.count * p.price
          } else {
            obj['Return Count'] += c?.count
            obj['Return Price'] += c?.count * p.price
            obj['Total Price'] += c?.count * p.price
          }
        })
        res.product.push(obj)
      })
      return res
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // get employee
  async getEmployee(employee_id: string) {
    const company = await this.#_prisma.employee.findFirst({
      where: {
        id: employee_id,
      },
    })
    console.log(company)

    try {
      // const products = await this.#_prisma.category.findMany({
      //   where:{
      //     companyId:company.companyId
      //   },
      //   select: {
      //     product:{
      //       select:{
      //         price: true,
      //         title: true,
      //         sale: {
      //           where: {
      //             employeeId: employee_id,
      //           },
      //           select: {
      //             count: true,
      //             deletedAt: true,
      //             mainSale: {
      //               select: {
      //                 payment: true,
      //                 priceCash: true,
      //                 pricePlastic: true,
      //               },
      //             },
      //           },
      //         },

      //       }
      //     }
      //   },
      // })

      const products = await this.#_prisma.product.findMany({
        where: {
          category: {
            companyId: company.companyId,
          },
        },
        select: {
          price: true,
          title: true,
          sale: {
            where: {
              employeeId: employee_id,
            },
            select: {
              count: true,
              deletedAt: true,
              mainSale: {
                select: {
                  payment: true,
                  priceCash: true,
                  pricePlastic: true,
                },
              },
            },
          },
        },
      })

      const summ = await this.#_prisma.mainSale.findMany({
        where: {
          employeeId: employee_id,
        },
        select: {
          priceCash: true,
          pricePlastic: true,
          deletedAt: true,
        },
      })

      const res = { cash: 0, plastic: 0, returns: 0, product: [] }

      summ.forEach((s) => {
        if (!s.deletedAt) {
          res.cash += s.priceCash
          res.plastic += s.pricePlastic
        } else {
          res.returns += s.priceCash + s.pricePlastic
        }
      })

      products.forEach((p) => {
        const obj = {
          'Product Title': p.title,
          'Product Price': p.price,
          'Sold Price': 0,
          'Sold Count': 0,
          'Return Price': 0,
          'Return Count': 0,
          'Total Price': 0,
        }
        p.sale.forEach((c) => {
          if (!c.deletedAt) {
            obj['Sold Count'] += c?.count
            obj['Sold Price'] += c?.count * p.price
            obj['Total Price'] += c?.count * p.price
          } else {
            obj['Return Count'] += c?.count
            obj['Return Price'] += c?.count
            obj['Total Price'] += c?.count * p.price
          }
        })
        res.product.push(obj)
      })

      return res
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}

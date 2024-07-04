import * as tmp from 'tmp'
import { Workbook } from 'exceljs'
import { Telegraf } from 'telegraf'
import { PrismaService } from '@prisma'
import { Cron, CronExpression } from '@nestjs/schedule'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class TasksService {
  readonly #_prisma: PrismaService
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron() {
    const token_bot = process.env.BOT_TOKEN
    const bot = new Telegraf(token_bot)

    // all company
    const companys = await this.#_prisma.company.findMany({
      select: {
        id: true,
        name: true,
        user: {
          select: {
            username: true,
            telegramId: true,
            id: true,
          },
        },
      },
    })

    companys.forEach(async (c) => {
      // sale
      const employess = await this.#_prisma.employee.findMany({
        where: {
          companyId: c.id,
        },
      })

      const res = []
      employess.forEach(async (e) => {
        const sale = await this.#_prisma.mainSale.findMany({
          where: {
            employeeId: e.id,
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
        sale.forEach((s) => {
          const obj = {
            Kassir: e.fname + ' ' + e.lname,
            Kompanya: c.name,
            'Check Id': s.id,
            'Naqt Pul': s.priceCash,
            'Plastik Pul': s.pricePlastic,
            Jami: s.priceAll,
            Vaqt: s.createdAt,
            'Tolov Turi': s.payment,
          }
          s.sale.map((a, idx) => {
            obj[
              `zakaz-${idx}`
            ] = `${a.product.title}/${a.count}/${a.product.price}`
          })

          if (res.length > 0) {
            if (Object.keys(res[0]).length <= Object.keys(obj).length) {
              res.push(res[0])
              res[0] = obj
            } else {
              res.push(obj)
            }
          } else {
            res.push(obj)
          }
        })
      })

      // statistika
      const products = await this.#_prisma.product.findMany({
        where: {
          category: {
            companyId: c.id,
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
      const productss = []
      products.forEach((p) => {
        const obj = {
          'Product Title': p.title,
          'Product Price': p.price,
          'Sold Count': 0,
          'Return Count': 0,
          'Sold Price': 0,
          'Return Price': 0,
          'Total Price': 0,
        }
        console.log(p, 'p')

        p.sale.forEach((c) => {
          if (!c.deletedAt) {
            obj['Sold Count'] += c?.count
            obj['Sold Price'] += c?.count * p.price
            obj['Total Price'] += c?.count * p.price
          } else {
            obj['Return Count'] += c?.count
            obj['Return Price'] += c?.count * p.price
            obj['Total Price'] += c?.count * p.price
          }
        })
        productss.push(obj)
      })

      setTimeout(async () => {
        // exel file
        if (res.length > 0 && productss.length > 0) {
          const rows1 = []
          res.forEach((doc) => {
            rows1.push(Object.values(doc))
          })
          const rows2 = []
          productss.forEach((doc) => {
            rows2.push(Object.values(doc))
          })
          const book = new Workbook()
          const sheet1 = book.addWorksheet(`Cheklar sahifasi`)
          const sheet2 = book.addWorksheet(`Statistika sahifasi`)
          rows1.unshift(Object.keys(res[0]))
          rows2.unshift(Object.keys(productss[0]))
          sheet1.addRows(rows1)
          sheet2.addRows(rows2)
          const File = await new Promise((resolve) => {
            tmp.file(
              {
                discardDescriptor: true,
                prefix: `${c.name}`,
                postfix: `.xlsx`,
                mode: parseInt(`0600`, 8),
              },
              async (err, file) => {
                if (err) {
                  throw new BadRequestException(err)
                }
                book.xlsx
                  .writeFile(file)
                  .then(() => {
                    resolve(file)
                  })
                  .catch((err) => {
                    throw new BadRequestException(err)
                  })
              },
            )
          })
          // telegram bot
          try {
            bot.telegram.sendDocument(Number(c.user.telegramId), {
              source: `${File}`,
            })
          } catch (error) {
            console.log(error)
          }
        } else {
          try {
            bot.telegram.sendMessage(Number(c.user.telegramId), {
              text: 'Bu oy sizda hech qanday savdo amalga oshirilmagan',
            })
          } catch (error) {
            console.log(error)
          }
        }
      }, 100)
    })

    // postgress tuncat
    setTimeout(async () => {
      const saleDel = this.#_prisma.sale.deleteMany()
      const mainSaleDel = this.#_prisma.mainSale.deleteMany()
      await this.#_prisma.$transaction([saleDel, mainSaleDel])
    }, 10000)
  }
}

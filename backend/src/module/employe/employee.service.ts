import { PrismaService } from '@prisma'
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { EmployeeCreateRequest, EmployeeUpdateRequest } from './interfaces'
import * as bcrypt from 'bcrypt'
import { InternalServerErrorException } from '@nestjs/common'

@Injectable()
export class EmployeeService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  //get all
  async getAll(id: string) {
    try {
      const res = await this.#_prisma.company.findMany({
        where: {
          id: id,
        },
        select: {
          user: {
            select: {
              username: true,
            },
          },
          employee: {
            select: {
              id: true,
              fname: true,
              lname: true,
              username: true,
              password: true,
              createdAt: true,
              IsAvailable: true,
            },
          },
        },
      })
      return res[0]
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  //get one
  async getOne(id: string, company_id: string) {
    try {
      const res = await this.#_prisma.employee.findFirst({
        where: {
          id: id,
          companyId: company_id,
        },
      })
      if (!res) {
        return new NotFoundException('employee not found')
      }
      return res
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // create
  async create(payload: EmployeeCreateRequest) {
    await this.#_checkEmployee(payload.username)

    const role = await this.#_prisma.role.findFirst({
      where: {
        name: 'kassir',
      },
      select: {
        id: true,
      },
    })
    if (!role) {
      throw new NotFoundException('kassir role not found')
    }
    const password = await bcrypt.hash(payload.password, 12)
    try {
      await this.#_prisma.user.create({
        data: {
          username: payload.username,
          password: password,
          roleId: role.id,
        },
      })
      const id = await this.#_prisma.user.findFirst({
        where: {
          username: payload.username,
        },
        select: {
          id: true,
        },
      })
      await this.#_prisma.employee.create({
        data: {
          fname: payload.fname,
          lname: payload.lname,
          username: payload.username,
          password,
          phone: payload.phone,
          email: payload.email,
          IsAvailable: payload.IsAvailable,
          companyId: payload.company_id,
          userId: id.id,
          roleId: role.id,
        },
      })
    } catch (error) {
      throw new NotFoundException('role and company')
    }
  }

  //update
  async update(payload: EmployeeUpdateRequest): Promise<void> {
    const { userId: id } = await this.#_foundedEmployee(payload.id)
    let password
    if (payload.password) {
      password = await bcrypt.hash(payload?.password, 12)
    }
    if (payload.username || payload.password) {
      try {
        await this.#_prisma.user.update({
          where: {
            id,
          },
          data: {
            username: payload.username,
            password,
          },
        })

        await this.#_prisma.employee.update({
          where: {
            id: payload.id,
          },
          data: {
            fname: payload.fname,
            lname: payload.lname,
            username: payload.username,
            email: payload.email,
            password,
            phone: payload.phone,
            IsAvailable: payload.IsAvailable,
          },
        })
      } catch (error) {
        throw new ConflictException('user already exists')
      }
    }
    try {
      await this.#_prisma.employee.update({
        where: {
          id: payload.id,
        },
        data: {
          fname: payload.fname,
          lname: payload.lname,
          email: payload.email,
          phone: payload.phone,
          IsAvailable: payload.IsAvailable,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  // delete
  async delete(id: string) {
    const { userId } = await this.#_foundedEmployee(id)
    try {
      await this.#_prisma.user.deleteMany({
        where: {
          id: userId,
        },
      })
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async #_checkEmployee(username: string) {
    const employee = await this.#_prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    })

    if (employee) {
      throw new ConflictException('employee already exists')
    }
  }

  async #_foundedEmployee(id: string) {
    const employee = await this.#_prisma.employee.findFirst({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    })

    if (!employee) {
      throw new NotFoundException('employee not found')
    }
    return employee
  }
}

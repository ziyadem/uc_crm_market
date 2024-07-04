import { PrismaService } from '@prisma'
import { JwtService } from '@nestjs/jwt'
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { refreshSign, sign } from 'helpers'
import { SignInRequest } from './interfaces'

@Injectable()
export class AuthService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService, private jwtService: JwtService) {
    this.#_prisma = prisma
  }
  // sign-in
  async signIn(payload: SignInRequest) {
    // founded user
    const res = await this.#_prisma.user.findFirst({
      where: {
        username: payload.username,
      },
      select: {
        id: true,
        password: true,
        role: {
          select: {
            name: true,
          },
        },
        company: {
          select: {
            IsActive: true,
          },
        },
      },
    })

    // user valid
    if (!res) {
      throw new NotFoundException(`Foydalanuvchi mavjud emas`)
    }

    // password verify
    const checkPsw = await bcrypt.compare(payload.password, res.password)
    if (!checkPsw) {
      throw new NotFoundException('Parol xato')
    }

    // supper admin
    if (res.role.name == 'super admin') {
      try {
        // token
        const rt = refreshSign({ id: res.id, role: 'super admin' })
        const at = sign({ id: res.id, role: 'super admin' })
        const tokenUser = await this.#_prisma.token.findFirst({
          where: {
            userId: res.id,
          },
        })

        // founded user token
        if (!tokenUser) {
          await this.#_prisma.token.create({
            data: {
              userId: res.id,
              accessToken: at,
              refreshToken: rt,
            },
          })
          return {
            accessToken: at,
            refreshToken: rt,
            role: 'super admin',
          }
        }

        // user token
        await this.#_prisma.token.update({
          where: {
            userId: res.id,
          },
          data: {
            accessToken: at,
            refreshToken: rt,
          },
        })
        return {
          accessToken: at,
          refreshToken: rt,
          role: 'super admin',
        }
      } catch (error) {
        throw new InternalServerErrorException('server error')
      }
    }

    // admin
    if (res.role.name == 'admin') {
      // company valid
      if (res.company.length === 0) {
        throw new NotFoundException('company not found')
      }
      if (!res.company[0].IsActive) {
        throw new NotFoundException('company block')
      }
      try {
        // token
        const rt = refreshSign({ id: res.id, role: 'admin' })
        const at = sign({ id: res.id, role: 'admin' })
        const tokenUser = await this.#_prisma.token.findFirst({
          where: {
            userId: res.id,
          },
        })

        // user token
        if (!tokenUser) {
          await this.#_prisma.token.create({
            data: {
              userId: res.id,
              accessToken: at,
              refreshToken: rt,
            },
          })
          return {
            accessToken: at,
            refreshToken: rt,
            role: 'admin',
          }
        }

        // user token
        await this.#_prisma.token.update({
          where: {
            userId: res.id,
          },
          data: {
            accessToken: at,
            refreshToken: rt,
          },
        })
        return {
          accessToken: at,
          refreshToken: rt,
          role: 'admin',
        }
      } catch (error) {
        throw new InternalServerErrorException('server error')
      }
    }

    // kassir
    if (res.role.name == 'kassir') {
      // founded employee
      const result = await this.#_prisma.employee.findFirst({
        where: {
          userId: res.id,
        },
        select: {
          id: true,
          password: true,
          IsAvailable: true,
          role: {
            select: {
              name: true,
            },
          },
          company: {
            select: {
              IsActive: true,
            },
          },
        },
      })

      // company empoyee
      if (!result.company.IsActive) {
        throw new NotFoundException('company block')
      }

      // company empoyee
      if (!result.IsAvailable) {
        throw new NotFoundException('employee block')
      }

      try {
        // token
        const rt = refreshSign({ id: res.id, role: 'kassir' })
        const at = sign({ id: res.id, role: 'kassir' })
        const tokenUser = await this.#_prisma.token.findFirst({
          where: {
            userId: res.id,
          },
        })

        // employee found
        if (!tokenUser) {
          await this.#_prisma.token.create({
            data: {
              userId: res.id,
              accessToken: at,
              refreshToken: rt,
            },
          })
          return {
            accessToken: at,
            refreshToken: rt,
            role: 'kassir',
          }
        }

        // create employee token
        await this.#_prisma.token.update({
          where: {
            userId: res.id,
          },
          data: {
            accessToken: at,
            refreshToken: rt,
          },
        })
        return {
          accessToken: at,
          refreshToken: rt,
          role: 'kassir',
        }
      } catch (error) {
        throw new InternalServerErrorException('server error')
      }
    }
  }

  // refresh
  async refresh(refreshToken: string) {
    // token verify
    let foundedUser = null
    try {
      foundedUser = await this.jwtService.verifyAsync(refreshToken)
    } catch (error) {
      throw new NotFoundException('refresh token invalid')
    }

    // founded user
    const res = await this.#_prisma.token.findFirst({
      where: {
        userId: foundedUser.id,
        refreshToken,
      },
    })

    // refresh token valid
    if (!res) {
      throw new NotFoundException('refresh token invalid')
    }
    try {
      // create token
      const at = sign({ id: foundedUser.id, role: foundedUser.role })
      await this.#_prisma.token.update({
        where: {
          userId: foundedUser.id,
        },
        data: {
          accessToken: at,
        },
      })
      return {
        accessToken: at,
        role: foundedUser.role,
      }
    } catch (error) {
      throw new InternalServerErrorException('server error')
    }
  }
}

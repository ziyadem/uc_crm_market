import {
  Inject,
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@prisma'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  @Inject() private readonly jwtService: JwtService
  @Inject() private readonly prisma: PrismaService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // request
    const request = context.switchToHttp().getRequest()

    // founded token
    let tokenId = request.headers.authorization
    if (!tokenId) {
      throw new UnauthorizedException('token not found')
    }

    // verify token
    let foundedUser = null
    try {
      if (tokenId.startsWith('Bearer ')) {
        tokenId = tokenId.substr('Bearer '.length)
      }
      foundedUser = await this.jwtService.verifyAsync(tokenId)
    } catch (error) {
      throw new UnauthorizedException('token invalid')
    }

    // token decode
    const decodeToken = await this.jwtService.decode(tokenId)
    if (!decodeToken) {
      throw new UnauthorizedException('token decode')
    }

    // token employee valid
    if (foundedUser.role == 'kassir') {
      const user = await this.prisma.employee.findFirst({
        where: {
          userId: foundedUser.id,
        },
        select: {
          id: true,
          companyId: true,
        },
      })

      // founded token
      if (!user) {
        throw new NotFoundException('token not found')
      }

      // request
      request.user = { ...user, role: 'kassir' }
    } else if (foundedUser.role == 'admin') {
      // token user valid
      const user = await this.prisma.user.findFirst({
        where: {
          id: foundedUser.id,
          role: {
            name: 'admin',
          },
        },
        select: {
          id: true,
          company: {
            select: {
              id: true,
            },
          },
        },
      })

      // not found token
      if (!user) {
        throw new NotFoundException()
      }

      // request
      request.user = {
        id: user.id,
        companyId: user.company[0].id,
        role: 'admin',
      }
    } else {
      // forbidden
      throw new ForbiddenException('szga mumkin emas')
    }
    return true
  }
}

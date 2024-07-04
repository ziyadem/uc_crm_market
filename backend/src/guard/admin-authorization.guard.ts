import {
  Inject,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@prisma'

export class AdminAuthorizationGuard implements CanActivate {
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

    // token user valid
    if (foundedUser.role !== 'admin') {
      throw new ForbiddenException('that does not belong to the token admin')
    }

    // founded user
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

    // user valid
    if (!user) {
      throw new ForbiddenException('that does not belong to the token admin')
    }

    // request
    request.user = { id: user.id, companyId: user?.company[0].id }

    return true
  }
}

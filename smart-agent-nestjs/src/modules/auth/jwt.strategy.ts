import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma.service'

function cookieExtractor(req: Request): string | null {
  if (req && req.cookies) {
    return req.cookies['access_token']
  }
  return null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
    })
  }

  async validate(payload: { sub: string; purpose: string }) {
    if (payload.purpose !== 'access_token') {
      throw new UnauthorizedException('Inveild token')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })
    if (!user) {
      return null
    }
    return user
  }
}

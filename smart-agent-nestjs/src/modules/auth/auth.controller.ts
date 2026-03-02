import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { BusinessUserAndTokensDTO, SignInDTO, SingUpWithConfirmPassword } from './auth.dto'
import { AuthService } from './auth.service'

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('signup')
  @ApiResponse({ type: BusinessUserAndTokensDTO })
  async singUp(
    @Body() data: SingUpWithConfirmPassword,
    @Res({ passthrough: true }) response: Response,
  ) {
    const auth = await this.AuthService.signup(data)

    response.cookie('access_token', auth.accessToken, {
      httpOnly: true,
      secure: false, // true em produção (HTTPS)
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 minutos
    })
    response.cookie('refresh_token', auth.refreshToken, {
      httpOnly: true,
      secure: false, // true em produção (HTTPS)
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 dias
    })

    return auth
  }

  @Post('signin')
  @ApiResponse({ type: BusinessUserAndTokensDTO })
  async singin(@Body() data: SignInDTO, @Res({ passthrough: true }) response: Response) {
    const auth = await this.AuthService.signIn(data)

    response.cookie('access_token', auth.accessToken, {
      httpOnly: true,
      secure: false, // true em produção (HTTPS)
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 minutos
    })
    response.cookie('refresh_token', auth.refreshToken, {
      httpOnly: true,
      secure: false, // true em produção (HTTPS)
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 dias
    })

    return auth
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies.refresh_token
    if (!token) {
      throw new UnauthorizedException('Refresh token não encontrado')
    }

    const auth = await this.AuthService.refresh(token)

    response.cookie('access_token', auth.accessToken, {
      httpOnly: true,
      secure: false, // true em produção (HTTPS)
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 minutos
    })

    response.cookie('refresh_token', auth.refreshToken, {
      httpOnly: true,
      secure: false, // true em produção (HTTPS)
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 dias
    })

    return auth
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    await this.AuthService.forgotPassword(data.email)
    return { message: 'Email enviar com sucesso!' }
  }

  @Post('reset-password')
  async resetPassword(@Body() data: any) {
    await this.AuthService.resetPassword(data)
    return { message: 'Senha atualizada com sucesso!' }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token')
    return { message: 'Logout realizado com sucesso!' }
  }
}

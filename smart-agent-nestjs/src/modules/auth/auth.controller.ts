import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/common/guards/jwt-auth/jwt-auth.guard";
import {
  BusinessUserAndTokensDTO,
  MessageReponceDTO,
  RefreshTokenReponceDTO,
  SignInDTO,
  SingUpWithConfirmPassword,
} from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller({
  version: "1",
  path: "auth",
})
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post("signup")
  @ApiCreatedResponse({ type: MessageReponceDTO })
  async singUp(@Body() data: SingUpWithConfirmPassword) {
    const auth = await this.AuthService.signup(data);

    return auth;
  }

  @Post("signin")
  @ApiOkResponse({ type: BusinessUserAndTokensDTO })
  async singin(
    @Body() data: SignInDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const auth = await this.AuthService.signIn(data);

    response.cookie("access_token", auth.accessToken, {
      httpOnly: false,
      secure: true, // true em produção (HTTPS)
      sameSite: "none",
      maxAge: 1000 * 60 * 15, // 15 minutos
    });
    response.cookie("refresh_token", auth.refreshToken, {
      httpOnly: true,
      secure: true, // true em produção (HTTPS)
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 dias
    });

    return auth;
  }

  @Get("verify")
  @UseGuards(JwtAuthGuard)
  verify() {
    return { ok: true };
  }

  @Post("refresh")
  @ApiOkResponse({ type: RefreshTokenReponceDTO })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies.refresh_token;
    if (!token) {
      throw new UnauthorizedException("Refresh token não encontrado");
    }

    const auth = await this.AuthService.refresh(token);

    response.cookie("access_token", auth.accessToken, {
      httpOnly: false,
      secure: true, // true em produção (HTTPS)
      sameSite: "none",
      maxAge: 1000 * 60 * 15, // 15 minutos
    });

    response.cookie("refresh_token", auth.refreshToken, {
      httpOnly: true,
      secure: true, // true em produção (HTTPS)
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 dias
    });

    return auth;
  }

  @Post("forgot-password")
  @ApiOkResponse({ type: MessageReponceDTO })
  async forgotPassword(@Body() data: { email: string }) {
    await this.AuthService.forgotPassword(data.email);
    return { message: "Email enviar com sucesso!" };
  }

  @Post("reset-password")
  @ApiOkResponse({ type: MessageReponceDTO })
  async resetPassword(@Body() data: any) {
    await this.AuthService.resetPassword(data);
    return { message: "Senha atualizada com sucesso!" };
  }

  @Get("logout")
  @ApiOkResponse({ type: MessageReponceDTO })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("access_token");
    return { message: "Logout realizado com sucesso!" };
  }
}

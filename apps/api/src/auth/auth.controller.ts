import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { loginSchema, registerSchema, verifyEmailSchema } from "@beecodefi/schemas";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AuthService } from "./auth.service";
import { SessionService } from "./session.service";
import { SessionGuard } from "./session.guard";
import type { GithubSignInProfile } from "./github.strategy";

@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionService,
  ) {}

  @Post("auth/register")
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: ReturnType<typeof registerSchema.parse>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.register(body);
    this.sessions.issue(res, { sub: user.id });
    return { id: user.id, email: user.email, displayName: user.displayName };
  }

  @Post("auth/login")
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: ReturnType<typeof loginSchema.parse>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.login(body);
    this.sessions.issue(res, { sub: user.id });
    return { id: user.id, email: user.email, displayName: user.displayName };
  }

  @Post("auth/logout")
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    this.sessions.clear(res);
  }

  @Post("auth/verify-email")
  async verifyEmail(
    @Body(new ZodValidationPipe(verifyEmailSchema)) body: ReturnType<typeof verifyEmailSchema.parse>,
  ) {
    const user = await this.auth.verifyEmail(body.token);
    return { id: user.id, emailVerified: user.emailVerified };
  }

  @Get("auth/oauth/github")
  @UseGuards(AuthGuard("github"))
  githubLogin() {
    // Guard redirects to GitHub; body never reached.
  }

  @Get("auth/oauth/github/callback")
  @UseGuards(AuthGuard("github"))
  async githubCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const profile = req.user as GithubSignInProfile;
    const user = await this.auth.findOrCreateFromGithub(profile);
    this.sessions.issue(res, { sub: user.id });
    return { id: user.id, email: user.email, displayName: user.displayName };
  }

  @Get("me")
  @UseGuards(SessionGuard)
  async me(@Req() req: Request) {
    const user = await this.auth.getProfile(req.userId!);
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      emailVerified: user.emailVerified,
      settings: user.settings,
      github: {
        connected: user.authProviders.some((p) => p.provider === "github"),
      },
    };
  }
}

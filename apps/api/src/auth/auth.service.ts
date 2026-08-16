import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";
import { EmailVerificationService } from "./email-verification.service";
import { MailService } from "./mail.service";
import type { GithubSignInProfile } from "./github.strategy";
import type { LoginInput, RegisterInput } from "@beecodefi/schemas";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly emailVerification: EmailVerificationService,
    private readonly config: ConfigService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictException({
        error: { code: "EMAIL_TAKEN", message: "An account with this email already exists." },
      });
    }

    const passwordHash = await argon2.hash(input.password);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        displayName: input.displayName,
        settings: { create: {} },
      },
    });

    const token = this.emailVerification.issueToken(user.id);
    const webUrl = this.config.get<string>("WEB_URL");
    await this.mail.sendVerificationEmail(user.email, `${webUrl}/auth/verify?token=${token}`);

    return user;
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." },
      });
    }
    const valid = await argon2.verify(user.passwordHash, input.password);
    if (!valid) {
      throw new UnauthorizedException({
        error: { code: "INVALID_CREDENTIALS", message: "Email or password is incorrect." },
      });
    }
    return user;
  }

  async verifyEmail(token: string) {
    const userId = this.emailVerification.verifyToken(token);
    if (!userId) {
      throw new UnauthorizedException({
        error: { code: "INVALID_TOKEN", message: "This verification link is invalid or expired." },
      });
    }
    return this.prisma.user.update({ where: { id: userId }, data: { emailVerified: true } });
  }

  async findOrCreateFromGithub(profile: GithubSignInProfile) {
    const existingLink = await this.prisma.userAuthProvider.findUnique({
      where: { provider_providerUserId: { provider: "github", providerUserId: profile.githubUserId } },
      include: { user: true },
    });
    if (existingLink) {
      return existingLink.user;
    }

    // Link to an existing email/password account with the same verified email, if any.
    const byEmail = profile.email
      ? await this.prisma.user.findUnique({ where: { email: profile.email } })
      : null;

    const user =
      byEmail ??
      (await this.prisma.user.create({
        data: {
          email: profile.email ?? `${profile.githubLogin}@users.noreply.github.com`,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          emailVerified: Boolean(profile.email),
          settings: { create: {} },
        },
      }));

    await this.prisma.userAuthProvider.create({
      data: { userId: user.id, provider: "github", providerUserId: profile.githubUserId },
    });

    return user;
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { settings: true, authProviders: true },
    });
  }
}

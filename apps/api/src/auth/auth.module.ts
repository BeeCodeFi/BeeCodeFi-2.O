import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionService } from "./session.service";
import { SessionGuard } from "./session.guard";
import { EmailVerificationService } from "./email-verification.service";
import { MailService } from "./mail.service";
import { GithubStrategy } from "./github.strategy";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "github" })],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    SessionGuard,
    EmailVerificationService,
    MailService,
    GithubStrategy,
  ],
  exports: [SessionService, SessionGuard],
})
export class AuthModule {}

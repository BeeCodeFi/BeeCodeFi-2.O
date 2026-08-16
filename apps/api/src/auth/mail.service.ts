import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    this.logger.log(`[dev] Verification link for ${to}: ${verifyUrl}`);
  }
}

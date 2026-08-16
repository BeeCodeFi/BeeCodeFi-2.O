import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";

const VERIFY_TTL_SECONDS = 60 * 60 * 24; // 24h

@Injectable()
export class EmailVerificationService {
  constructor(private readonly config: ConfigService) {}

  private get secret(): string {
    const secret = this.config.get<string>("EMAIL_VERIFICATION_SECRET");
    if (!secret) {
      throw new Error("EMAIL_VERIFICATION_SECRET is not configured");
    }
    return secret;
  }

  issueToken(userId: string): string {
    return jwt.sign({ sub: userId, purpose: "verify-email" }, this.secret, {
      expiresIn: VERIFY_TTL_SECONDS,
    });
  }

  verifyToken(token: string): string | null {
    try {
      const payload = jwt.verify(token, this.secret) as { sub: string; purpose: string };
      return payload.purpose === "verify-email" ? payload.sub : null;
    } catch {
      return null;
    }
  }
}

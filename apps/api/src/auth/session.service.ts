import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import jwt from "jsonwebtoken";

const SESSION_COOKIE = "bcf_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  sub: string; // user id
}

@Injectable()
export class SessionService {
  constructor(private readonly config: ConfigService) {}

  private get secret(): string {
    const secret = this.config.get<string>("SESSION_SECRET");
    if (!secret) {
      throw new Error("SESSION_SECRET is not configured");
    }
    return secret;
  }

  issue(res: Response, payload: SessionPayload) {
    const token = jwt.sign(payload, this.secret, { expiresIn: SESSION_TTL_SECONDS });
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: this.config.get<string>("NODE_ENV") === "production",
      sameSite: "lax",
      maxAge: SESSION_TTL_SECONDS * 1000,
      path: "/",
    });
  }

  clear(res: Response) {
    res.clearCookie(SESSION_COOKIE, { path: "/" });
  }

  verify(token: string | undefined): SessionPayload | null {
    if (!token) return null;
    try {
      return jwt.verify(token, this.secret) as SessionPayload;
    } catch {
      return null;
    }
  }

  readonly cookieName = SESSION_COOKIE;
}

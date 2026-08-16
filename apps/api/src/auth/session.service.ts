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

  // Web and API live on different domains (vercel.app / onrender.com), so
  // this is a cross-site request from the browser's point of view. Only
  // SameSite=None is sent on cross-site fetches, and browsers require
  // Secure whenever SameSite=None is used.
  private get crossSiteCookieOptions() {
    const isProd = this.config.get<string>("NODE_ENV") === "production";
    return {
      secure: isProd,
      sameSite: isProd ? ("none" as const) : ("lax" as const),
    };
  }

  issue(res: Response, payload: SessionPayload) {
    const token = jwt.sign(payload, this.secret, { expiresIn: SESSION_TTL_SECONDS });
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      ...this.crossSiteCookieOptions,
      maxAge: SESSION_TTL_SECONDS * 1000,
      path: "/",
    });
  }

  clear(res: Response) {
    res.clearCookie(SESSION_COOKIE, { path: "/", ...this.crossSiteCookieOptions });
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

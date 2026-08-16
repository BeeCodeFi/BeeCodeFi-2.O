import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { SessionService } from "./session.service";

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessions: SessionService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const payload = this.sessions.verify(req.cookies?.[this.sessions.cookieName]);
    if (!payload) {
      throw new UnauthorizedException({ error: { code: "UNAUTHENTICATED", message: "Sign in required." } });
    }
    req.userId = payload.sub;
    return true;
  }
}

/**
 * Attaches `req.userId` when a valid session cookie is present, but never
 * blocks the request — used by Read-stage content routes that stay public
 * (SEO, `06 §2`) while still returning per-user stage state when logged in.
 */
@Injectable()
export class OptionalSessionGuard implements CanActivate {
  constructor(private readonly sessions: SessionService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const payload = this.sessions.verify(req.cookies?.[this.sessions.cookieName]);
    if (payload) {
      req.userId = payload.sub;
    }
    return true;
  }
}

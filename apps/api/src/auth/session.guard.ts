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

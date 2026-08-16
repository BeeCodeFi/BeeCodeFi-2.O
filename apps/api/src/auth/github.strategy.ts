import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-github2";

export interface GithubSignInProfile {
  githubUserId: string;
  githubLogin: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>("GITHUB_CLIENT_ID"),
      clientSecret: config.get<string>("GITHUB_CLIENT_SECRET"),
      callbackURL: config.get<string>("GITHUB_CALLBACK_URL"),
      // Sign-in scope only (04 §1) — public_repo is requested later, lazily,
      // when the learner first pushes.
      scope: ["read:user", "user:email"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<GithubSignInProfile> {
    const primaryEmail = profile.emails?.[0]?.value ?? null;
    return {
      githubUserId: profile.id,
      githubLogin: profile.username ?? profile.id,
      email: primaryEmail,
      displayName: profile.displayName || profile.username || profile.id,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    };
  }
}

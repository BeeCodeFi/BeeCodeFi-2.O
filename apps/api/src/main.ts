import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  // Origin headers never carry a trailing slash — strip one from WEB_URL so a
  // stray slash in the env var doesn't silently break every CORS preflight.
  const webUrl = config.get<string>("WEB_URL")?.replace(/\/+$/, "");
  app.enableCors({
    origin: webUrl,
    credentials: true,
  });
  app.setGlobalPrefix("api/v1", { exclude: ["health"] });

  const port = config.get<number>("PORT") ?? 4000;
  await app.listen(port);
}

bootstrap();

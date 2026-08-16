import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: config.get<string>("WEB_URL"),
    credentials: true,
  });
  app.setGlobalPrefix("api/v1", { exclude: ["health"] });

  const port = config.get<number>("PORT") ?? 4000;
  await app.listen(port);
}

bootstrap();

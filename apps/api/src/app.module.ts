import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ContentModule } from "./content/content.module";
import { ProgressModule } from "./progress/progress.module";
import { EditorModule } from "./editor/editor.module";
import { QuizModule } from "./quiz/quiz.module";
import { SubmissionModule } from "./submission/submission.module";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ContentModule,
    ProgressModule,
    EditorModule,
    QuizModule,
    SubmissionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProgressModule } from "../progress/progress.module";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";

@Module({
  imports: [AuthModule, ProgressModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}

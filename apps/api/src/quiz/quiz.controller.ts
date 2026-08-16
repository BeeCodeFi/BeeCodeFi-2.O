import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { submitAttemptRequestSchema } from "@beecodefi/schemas";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { SessionGuard } from "../auth/session.guard";
import { QuizService } from "./quiz.service";

@Controller()
@UseGuards(SessionGuard)
export class QuizController {
  constructor(private readonly quiz: QuizService) {}

  @Post("quizzes/:id/attempts")
  startAttempt(@Req() req: Request, @Param("id") id: string) {
    return this.quiz.startAttempt(req.userId!, id);
  }

  @Post("quiz-attempts/:id/submit")
  submitAttempt(
    @Req() req: Request,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(submitAttemptRequestSchema))
    body: ReturnType<typeof submitAttemptRequestSchema.parse>,
  ) {
    return this.quiz.submitAttempt(req.userId!, id, body);
  }

  @Get("quizzes/:id/practice-pool")
  practicePool(@Req() req: Request, @Param("id") id: string) {
    return this.quiz.practicePool(req.userId!, id);
  }
}

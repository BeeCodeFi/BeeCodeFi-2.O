import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { checkpointRequestSchema, sectionReadsRequestSchema } from "@beecodefi/schemas";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { SessionGuard } from "../auth/session.guard";
import { ProgressService } from "./progress.service";

@Controller("progress")
@UseGuards(SessionGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Post("section-reads")
  async sectionReads(
    @Req() req: Request,
    @Body(new ZodValidationPipe(sectionReadsRequestSchema))
    body: ReturnType<typeof sectionReadsRequestSchema.parse>,
  ) {
    await this.progress.recordSectionReads(req.userId!, body.reads);
    return { recorded: body.reads.length };
  }

  @Post("checkpoint")
  async checkpoint(
    @Req() req: Request,
    @Body(new ZodValidationPipe(checkpointRequestSchema))
    body: ReturnType<typeof checkpointRequestSchema.parse>,
  ) {
    return this.progress.recordCheckpoint(req.userId!, body.lessonId);
  }

  @Get("courses/:slug")
  courseProgress(@Req() req: Request, @Param("slug") slug: string) {
    return this.progress.getCourseProgress(req.userId!, slug);
  }

  @Get("summary")
  summary(@Req() req: Request) {
    return this.progress.getSummary(req.userId!);
  }
}

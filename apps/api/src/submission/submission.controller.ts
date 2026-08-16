import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { onsiteEditorSubmissionRequestSchema } from "@beecodefi/schemas";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { SessionGuard } from "../auth/session.guard";
import { SubmissionService } from "./submission.service";

const MAX_UPLOAD_BYTES = 1_000_000;

@Controller()
@UseGuards(SessionGuard)
export class SubmissionController {
  constructor(private readonly submissions: SubmissionService) {}

  @Get("tasks/:id")
  getTask(@Req() req: Request, @Param("id") id: string) {
    return this.submissions.getTask(req.userId!, id);
  }

  @Post("tasks/:id/submissions")
  @UseInterceptors(FilesInterceptor("files", 5, { limits: { fileSize: MAX_UPLOAD_BYTES } }))
  async submit(
    @Req() req: Request,
    @Param("id") id: string,
    @UploadedFiles() files: Array<{ originalname: string; mimetype: string; size: number; buffer: Buffer }>,
    @Body() body: Record<string, unknown>,
  ) {
    if (files && files.length > 0) {
      return this.submissions.submitUpload(req.userId!, id, files);
    }
    if (body.method === "onsite_editor") {
      const parsed = onsiteEditorSubmissionRequestSchema.safeParse(body);
      if (!parsed.success) {
        throw new BadRequestException({
          error: { code: "VALIDATION_ERROR", message: "Invalid submission body.", details: { issues: parsed.error.issues } },
        });
      }
      return this.submissions.submitOnsiteEditor(req.userId!, id, parsed.data);
    }
    throw new BadRequestException({
      error: { code: "UNSUPPORTED_METHOD", message: "Provide files[] or method=onsite_editor." },
    });
  }

  @Get("submissions/:id")
  getSubmission(@Req() req: Request, @Param("id") id: string) {
    return this.submissions.getSubmission(req.userId!, id);
  }
}

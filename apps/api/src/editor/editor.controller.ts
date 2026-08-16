import { Body, Controller, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { putSnapshotRequestSchema } from "@beecodefi/schemas";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { SessionGuard } from "../auth/session.guard";
import { EditorService } from "./editor.service";

@Controller("editor")
@UseGuards(SessionGuard)
export class EditorController {
  constructor(private readonly editor: EditorService) {}

  @Get(":lessonId/snapshot")
  getSnapshot(@Req() req: Request, @Param("lessonId") lessonId: string) {
    return this.editor.getSnapshot(req.userId!, lessonId);
  }

  @Put(":lessonId/snapshot")
  putSnapshot(
    @Req() req: Request,
    @Param("lessonId") lessonId: string,
    @Body(new ZodValidationPipe(putSnapshotRequestSchema))
    body: ReturnType<typeof putSnapshotRequestSchema.parse>,
  ) {
    return this.editor.putSnapshot(req.userId!, lessonId, body.code, body.isManual);
  }
}

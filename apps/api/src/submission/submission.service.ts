import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { AutoCheckReport, OnsiteEditorSubmissionRequest, TaskDetail } from "@beecodefi/schemas";
import { PrismaService } from "../prisma/prisma.service";
import { ProgressService } from "../progress/progress.service";
import { checkRubric, Rubric } from "./rubric-checker";

const MAX_UPLOAD_BYTES = 1_000_000;
const ALLOWED_EXTENSIONS = [".html", ".css", ".js", ".zip"];

@Injectable()
export class SubmissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progress: ProgressService,
  ) {}

  async getTask(userId: string, taskId: string): Promise<TaskDetail> {
    const task = await this.prisma.practiceTask.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException({ error: { code: "TASK_NOT_FOUND", message: "Task not found." } });
    }
    const latest = await this.prisma.taskSubmission.findFirst({
      where: { userId, taskId },
      orderBy: { submittedAt: "desc" },
    });
    return {
      id: task.id,
      title: task.title,
      briefCdnPath: task.briefCdnPath,
      starterCodeCdnPath: task.starterCodeCdnPath,
      requiresUpload: task.requiresUpload,
      latestSubmission: latest
        ? {
            id: latest.id,
            method: latest.method as NonNullable<TaskDetail["latestSubmission"]>["method"],
            status: latest.status as NonNullable<TaskDetail["latestSubmission"]>["status"],
            autoCheckReport: (latest.autoCheckReport as AutoCheckReport | null) ?? null,
            submittedAt: latest.submittedAt.toISOString(),
          }
        : null,
    };
  }

  async submitOnsiteEditor(userId: string, taskId: string, body: OnsiteEditorSubmissionRequest) {
    const task = await this.getTaskOrThrow(taskId);
    const report = checkRubric(body.code.html, task.rubric as unknown as Rubric);
    return this.persistSubmission(userId, task.id, task.lessonId, "onsite_editor", report, [
      { filename: "index.html", mime: "text/html", content: body.code.html },
    ]);
  }

  async submitUpload(userId: string, taskId: string, files: Array<{ originalname: string; mimetype: string; size: number; buffer: Buffer }>) {
    const task = await this.getTaskOrThrow(taskId);
    if (files.length === 0) {
      throw new BadRequestException({ error: { code: "NO_FILES", message: "Attach at least one file." } });
    }
    for (const file of files) {
      if (file.size > MAX_UPLOAD_BYTES) {
        throw new BadRequestException({ error: { code: "FILE_TOO_LARGE", message: `${file.originalname} exceeds 1 MB.` } });
      }
      const ext = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new BadRequestException({
          error: { code: "UNSUPPORTED_FILE_TYPE", message: `${file.originalname} must be .html, .css, .js, or .zip.` },
        });
      }
    }

    const htmlFile = files.find((f) => f.originalname.toLowerCase().endsWith(".html"));
    const report = htmlFile
      ? checkRubric(htmlFile.buffer.toString("utf-8"), task.rubric as unknown as Rubric)
      : { passed: false, issues: [{ code: "NO_HTML_FILE", message: "Upload an .html file to auto-check (zip review is manual for now)." }] };

    return this.persistSubmission(
      userId,
      task.id,
      task.lessonId,
      "upload",
      report,
      files.map((f) => ({ filename: f.originalname, mime: f.mimetype, content: f.buffer.toString("base64") })),
    );
  }

  private async getTaskOrThrow(taskId: string) {
    const task = await this.prisma.practiceTask.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException({ error: { code: "TASK_NOT_FOUND", message: "Task not found." } });
    }
    return task;
  }

  private async persistSubmission(
    userId: string,
    taskId: string,
    lessonId: string,
    method: "onsite_editor" | "upload",
    report: AutoCheckReport,
    files: Array<{ filename: string; mime: string; content: string }>,
  ) {
    const submission = await this.prisma.taskSubmission.create({
      data: {
        userId,
        taskId,
        method,
        status: report.passed ? "passed" : "needs_rework",
        autoCheckReport: report,
        files: {
          create: files.map((f) => ({
            filename: f.filename,
            mime: f.mime,
            sizeBytes: Buffer.byteLength(f.content),
            storageKey: `${userId}/${taskId}/${f.filename}`,
            content: f.content,
          })),
        },
      },
    });

    if (report.passed) {
      await this.progress.markTaskComplete(userId, lessonId);
    }

    return { id: submission.id, status: submission.status, autoCheckReport: report };
  }

  async getSubmission(userId: string, id: string) {
    const submission = await this.prisma.taskSubmission.findUnique({ where: { id } });
    if (!submission || submission.userId !== userId) {
      throw new NotFoundException({ error: { code: "SUBMISSION_NOT_FOUND", message: "Submission not found." } });
    }
    return {
      id: submission.id,
      status: submission.status,
      autoCheckReport: submission.autoCheckReport as AutoCheckReport | null,
    };
  }
}

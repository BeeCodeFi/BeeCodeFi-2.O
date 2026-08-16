import { Injectable } from "@nestjs/common";
import type { EditorCode, SnapshotResponse } from "@beecodefi/schemas";
import { PrismaService } from "../prisma/prisma.service";
import { ProgressService } from "../progress/progress.service";

const MAX_SNAPSHOTS_PER_LESSON = 20;
const MEANINGFUL_EDIT_MIN_CHARS = 30;

@Injectable()
export class EditorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progress: ProgressService,
  ) {}

  async getSnapshot(userId: string, lessonId: string): Promise<SnapshotResponse> {
    const starterCode = await this.getStarterCode(lessonId);
    const latest = await this.prisma.editorSnapshot.findFirst({
      where: { userId, lessonId },
      orderBy: { savedAt: "desc" },
    });
    if (!latest) {
      return { code: starterCode, starterCode, savedAt: null, isStarter: true };
    }
    return {
      code: latest.code as EditorCode,
      starterCode,
      savedAt: latest.savedAt.toISOString(),
      isStarter: false,
    };
  }

  async putSnapshot(userId: string, lessonId: string, code: EditorCode, isManual: boolean) {
    await this.prisma.editorSnapshot.create({
      data: { userId, lessonId, code, isManual },
    });
    await this.pruneOldSnapshots(userId, lessonId);

    const starterCode = await this.getStarterCode(lessonId);
    const diffChars = Math.abs(
      code.html.length + code.css.length + code.js.length -
        (starterCode.html.length + starterCode.css.length + starterCode.js.length),
    );
    if (diffChars >= MEANINGFUL_EDIT_MIN_CHARS) {
      await this.progress.markPracticed(userId, lessonId);
    }

    return { saved: true };
  }

  private async getStarterCode(lessonId: string): Promise<EditorCode> {
    const task = await this.prisma.practiceTask.findUnique({ where: { lessonId } });
    const fallback: EditorCode = { html: "", css: "", js: "" };
    if (!task) return fallback;
    return { ...fallback, ...(task.starterCode as Partial<EditorCode>) };
  }

  private async pruneOldSnapshots(userId: string, lessonId: string) {
    const rows = await this.prisma.editorSnapshot.findMany({
      where: { userId, lessonId },
      orderBy: { savedAt: "desc" },
      skip: MAX_SNAPSHOTS_PER_LESSON,
      select: { id: true },
    });
    if (rows.length > 0) {
      await this.prisma.editorSnapshot.deleteMany({ where: { id: { in: rows.map((r) => r.id) } } });
    }
  }
}

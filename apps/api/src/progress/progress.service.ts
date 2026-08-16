import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type {
  CourseProgressResponse,
  ProgressSummaryResponse,
  SectionReadInput,
} from "@beecodefi/schemas";
import { PrismaService } from "../prisma/prisma.service";
import { computeLessonStages, isLessonComplete } from "../common/loop-stage";

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private async upsertProgress(userId: string, lessonId: string) {
    return this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId },
      update: {},
    });
  }

  async recordSectionReads(userId: string, reads: SectionReadInput[]) {
    const sections = await this.prisma.lessonSection.findMany({
      where: { id: { in: reads.map((r) => r.sectionId) } },
    });
    const sectionById = new Map(sections.map((s) => [s.id, s]));

    for (const read of reads) {
      const section = sectionById.get(read.sectionId);
      if (!section) continue;
      // Anti-gaming per `04 §Stage 1`: never trust a dwell report larger than
      // one section's worth of wall-clock time in a single 15s flush window.
      const dwellSeconds = Math.min(read.dwellSeconds, 15);
      const completed = read.maxScrollPct >= 60 && dwellSeconds >= 0;

      const existing = await this.prisma.sectionRead.findUnique({
        where: { userId_sectionId: { userId, sectionId: section.id } },
      });
      const nextDwell = (existing?.dwellSeconds ?? 0) + dwellSeconds;
      const nextScroll = Math.max(Number(existing?.maxScrollPct ?? 0), read.maxScrollPct);

      await this.prisma.sectionRead.upsert({
        where: { userId_sectionId: { userId, sectionId: section.id } },
        create: {
          userId,
          sectionId: section.id,
          dwellSeconds: nextDwell,
          maxScrollPct: nextScroll,
          completed: nextDwell >= section.minDwellSeconds && completed,
        },
        update: {
          dwellSeconds: nextDwell,
          maxScrollPct: nextScroll,
          completed: nextDwell >= section.minDwellSeconds && nextScroll >= 60,
        },
      });
    }

    await this.maybeCompleteRead(userId, sections[0]?.lessonId);
  }

  private async maybeCompleteRead(userId: string, lessonId: string | undefined) {
    if (!lessonId) return;
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { sections: true },
    });
    if (!lesson || lesson.sections.length === 0) return;

    const reads = await this.prisma.sectionRead.findMany({
      where: { userId, sectionId: { in: lesson.sections.map((s) => s.id) } },
    });
    const allComplete = lesson.sections.every((s) =>
      reads.some((r) => r.sectionId === s.id && r.completed),
    );
    const totalDwell = reads.reduce((sum, r) => sum + r.dwellSeconds, 0);
    const estSeconds = lesson.estReadMinutes * 60;

    if (allComplete && totalDwell >= estSeconds * 0.5) {
      const progress = await this.upsertProgress(userId, lessonId);
      if (!progress.readCompletedAt) {
        await this.prisma.lessonProgress.update({
          where: { userId_lessonId: { userId, lessonId } },
          data: { readCompletedAt: new Date() },
        });
      }
      await this.maybeCompleteLesson(userId, lessonId);
    }
  }

  async recordCheckpoint(userId: string, lessonId: string) {
    // Phase 1: the checkpoint's only job is to cost a script real interaction
    // (`04 §Stage 1` anti-gaming) — grading it isn't load-bearing for the
    // loop, so any submitted answer counts. Full grading can be added once
    // checkpoint answer keys move into the content pipeline (Phase 3).
    await this.upsertProgress(userId, lessonId);
    return { recorded: true };
  }

  async markPracticed(userId: string, lessonId: string) {
    const progress = await this.upsertProgress(userId, lessonId);
    if (!progress.editorPracticedAt) {
      await this.prisma.lessonProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: { editorPracticedAt: new Date() },
      });
    }
    await this.maybeCompleteLesson(userId, lessonId);
  }

  async markQuizPassed(userId: string, lessonId: string) {
    const progress = await this.upsertProgress(userId, lessonId);
    if (!progress.quizPassedAt) {
      await this.prisma.lessonProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: { quizPassedAt: new Date() },
      });
    }
    await this.maybeCompleteLesson(userId, lessonId);
  }

  async markTaskComplete(userId: string, lessonId: string) {
    const progress = await this.upsertProgress(userId, lessonId);
    if (!progress.quizPassedAt) {
      throw new BadRequestException({
        error: { code: "QUIZ_NOT_PASSED", message: "Build unlocks after passing the quiz." },
      });
    }
    if (!progress.taskCompletedAt) {
      await this.prisma.lessonProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: { taskCompletedAt: new Date() },
      });
    }
    await this.maybeCompleteLesson(userId, lessonId);
  }

  private async maybeCompleteLesson(userId: string, lessonId: string) {
    const progress = await this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
    if (progress && !progress.completedAt && isLessonComplete(progress)) {
      await this.prisma.lessonProgress.update({
        where: { userId_lessonId: { userId, lessonId } },
        data: { completedAt: new Date() },
      });
    }
  }

  async getStageStatesForLesson(userId: string | undefined, lessonId: string) {
    if (!userId) return null;
    const [progress, hasQuizAttempt, hasSubmission] = await Promise.all([
      this.prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId } } }),
      this.prisma.quizAttempt.findFirst({
        where: { userId, quiz: { lessonId } },
        select: { id: true },
      }),
      this.prisma.taskSubmission.findFirst({
        where: { userId, task: { lessonId } },
        select: { id: true },
      }),
    ]);
    return computeLessonStages(progress ?? null, {
      hasQuizAttempt: Boolean(hasQuizAttempt),
      hasSubmission: Boolean(hasSubmission),
    });
  }

  async getCourseProgress(userId: string, courseSlug: string): Promise<CourseProgressResponse> {
    const course = await this.prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { modules: { include: { lessons: true }, orderBy: { orderIndex: "asc" } } },
    });
    if (!course) {
      throw new NotFoundException({ error: { code: "COURSE_NOT_FOUND", message: "Course not found." } });
    }

    const lessons = course.modules.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, moduleSlug: m.slug })),
    );
    const progressRows = await this.prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: lessons.map((l) => l.id) } },
    });
    const progressByLesson = new Map(progressRows.map((p) => [p.lessonId, p]));

    const items = await Promise.all(
      lessons.map(async (lesson) => {
        const progress = progressByLesson.get(lesson.id) ?? null;
        const stages = await this.getStageStatesForLesson(userId, lesson.id);
        return {
          lessonId: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          moduleSlug: lesson.moduleSlug,
          stages: stages!,
          completedAt: progress?.completedAt?.toISOString() ?? null,
        };
      }),
    );

    const completedCount = items.filter((i) => i.completedAt).length;
    const percentComplete = lessons.length === 0 ? 0 : (completedCount / lessons.length) * 100;

    return { courseSlug, percentComplete, lessons: items };
  }

  async getSummary(userId: string): Promise<ProgressSummaryResponse> {
    const started = await this.prisma.lessonProgress.findMany({ where: { userId } });
    const coursesStarted = started.length > 0 ? 1 : 0; // single-course Phase 1

    const pending = await this.prisma.lessonProgress.findFirst({
      where: { userId, completedAt: null },
      include: { lesson: { include: { module: { include: { course: true } } } } },
      orderBy: { lesson: { orderIndex: "asc" } },
    });

    let resumeLesson = pending;
    if (!resumeLesson) {
      resumeLesson = await this.prisma.lessonProgress.findFirst({
        where: { userId },
        include: { lesson: { include: { module: { include: { course: true } } } } },
      });
    }
    if (!resumeLesson) {
      const firstLesson = await this.prisma.lesson.findFirst({
        orderBy: { orderIndex: "asc" },
        include: { module: { include: { course: true } } },
      });
      if (!firstLesson) return { coursesStarted, resume: null };
      return {
        coursesStarted,
        resume: {
          courseSlug: firstLesson.module.course.slug,
          moduleSlug: firstLesson.module.slug,
          lessonSlug: firstLesson.slug,
          stage: "read",
        },
      };
    }

    const stages = computeLessonStages(resumeLesson);
    const stage = (["read", "practice", "quiz", "build"] as const).find(
      (s) => stages[s] !== "done" && stages[s] !== "locked",
    ) ?? "read";

    return {
      coursesStarted,
      resume: {
        courseSlug: resumeLesson.lesson.module.course.slug,
        moduleSlug: resumeLesson.lesson.module.slug,
        lessonSlug: resumeLesson.lesson.slug,
        stage,
      },
    };
  }
}

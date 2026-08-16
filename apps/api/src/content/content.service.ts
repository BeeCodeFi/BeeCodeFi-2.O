import { Injectable, NotFoundException } from "@nestjs/common";
import type { CourseDetail, CourseSummary, LessonDetail } from "@beecodefi/schemas";
import { PrismaService } from "../prisma/prisma.service";
import { ProgressService } from "../progress/progress.service";

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progress: ProgressService,
  ) {}

  async listCourses(): Promise<CourseSummary[]> {
    const courses = await this.prisma.course.findMany({
      where: { status: "published" },
      orderBy: { orderIndex: "asc" },
    });
    return courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
    }));
  }

  async getCourse(slug: string, userId?: string): Promise<CourseDetail> {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { orderIndex: "asc" },
          include: { lessons: { orderBy: { orderIndex: "asc" } } },
        },
      },
    });
    if (!course) {
      throw new NotFoundException({ error: { code: "COURSE_NOT_FOUND", message: "Course not found." } });
    }

    const modules = await Promise.all(
      course.modules.map(async (m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        orderIndex: m.orderIndex,
        lessons: await Promise.all(
          m.lessons.map(async (l) => ({
            id: l.id,
            slug: l.slug,
            title: l.title,
            orderIndex: l.orderIndex,
            stages: await this.progress.getStageStatesForLesson(userId, l.id),
          })),
        ),
      })),
    );

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      modules,
    };
  }

  async getLesson(id: string, userId?: string): Promise<LessonDetail> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        module: { include: { course: true } },
        sections: { orderBy: { orderIndex: "asc" } },
        quiz: true,
        task: true,
      },
    });
    if (!lesson) {
      throw new NotFoundException({ error: { code: "LESSON_NOT_FOUND", message: "Lesson not found." } });
    }

    return {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      cdnPath: lesson.cdnPath,
      estReadMinutes: lesson.estReadMinutes,
      courseSlug: lesson.module.course.slug,
      moduleSlug: lesson.module.slug,
      sections: lesson.sections.map((s) => ({
        id: s.id,
        anchor: s.anchor,
        orderIndex: s.orderIndex,
        minDwellSeconds: s.minDwellSeconds,
      })),
      quiz: lesson.quiz
        ? {
            id: lesson.quiz.id,
            questionsServed: lesson.quiz.questionsServed,
            passThreshold: Number(lesson.quiz.passThreshold),
          }
        : null,
      task: lesson.task
        ? {
            id: lesson.task.id,
            title: lesson.task.title,
            briefCdnPath: lesson.task.briefCdnPath,
            starterCodeCdnPath: lesson.task.starterCodeCdnPath,
            requiresUpload: lesson.task.requiresUpload,
          }
        : null,
      stages: await this.progress.getStageStatesForLesson(userId, lesson.id),
    };
  }
}

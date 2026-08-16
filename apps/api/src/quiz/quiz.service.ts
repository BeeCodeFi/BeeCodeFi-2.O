import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import type { StartAttemptResponse, SubmitAttemptRequest, SubmitAttemptResponse } from "@beecodefi/schemas";
import { PrismaService } from "../prisma/prisma.service";
import { ProgressService } from "../progress/progress.service";

const ATTEMPT_EXPIRY_MS = 24 * 60 * 60 * 1000;

function pickRandom<T>(pool: T[], count: number): T[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j]!;
    copy[j] = temp!;
  }
  return copy.slice(0, count);
}

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly progress: ProgressService,
  ) {}

  async startAttempt(userId: string, quizId: string): Promise<StartAttemptResponse> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { where: { active: true } } },
    });
    if (!quiz) {
      throw new NotFoundException({ error: { code: "QUIZ_NOT_FOUND", message: "Quiz not found." } });
    }

    const priorAttempts = await this.prisma.quizAttempt.count({ where: { userId, quizId } });
    if (quiz.maxAttempts && priorAttempts >= quiz.maxAttempts) {
      throw new ForbiddenException({
        error: { code: "MAX_ATTEMPTS_REACHED", message: "No attempts remaining for this quiz." },
      });
    }

    const selected = pickRandom(quiz.questions, Math.min(quiz.questionsServed, quiz.questions.length));

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        attemptNo: priorAttempts + 1,
        questionIds: selected.map((q) => q.id),
      },
    });

    return {
      attemptId: attempt.id,
      attemptNo: attempt.attemptNo,
      questions: selected.map((q) => ({
        id: q.id,
        qtype: q.qtype as StartAttemptResponse["questions"][number]["qtype"],
        difficulty: q.difficulty as StartAttemptResponse["questions"][number]["difficulty"],
        payloadCdnPath: q.payloadCdnPath,
      })),
    };
  }

  async submitAttempt(
    userId: string,
    attemptId: string,
    body: SubmitAttemptRequest,
  ): Promise<SubmitAttemptResponse> {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { quiz: { include: { questions: true, lesson: true } } },
    });
    if (!attempt || attempt.userId !== userId) {
      throw new NotFoundException({ error: { code: "ATTEMPT_NOT_FOUND", message: "Attempt not found." } });
    }
    if (attempt.submittedAt) {
      throw new BadRequestException({
        error: { code: "ATTEMPT_ALREADY_SUBMITTED", message: "This attempt was already graded." },
      });
    }
    if (Date.now() - attempt.startedAt.getTime() > ATTEMPT_EXPIRY_MS) {
      throw new BadRequestException({
        error: { code: "QUIZ_ATTEMPT_EXPIRED", message: "This attempt expired 24h after starting." },
      });
    }

    const questionById = new Map(attempt.quiz.questions.map((q) => [q.id, q]));
    const answerByQuestion = new Map(body.answers.map((a) => [a.questionId, a.answer]));

    let correctCount = 0;
    const results = attempt.questionIds.map((questionId) => {
      const question = questionById.get(questionId);
      const answer = answerByQuestion.get(questionId);
      const isCorrect = question ? gradeAnswer(question.qtype, question.answerKey, answer) : false;
      if (isCorrect) correctCount += 1;
      return {
        questionId,
        isCorrect,
        answer: answer ?? null,
        explanationCdnPath: question?.explanationCdnPath ?? null,
      };
    });

    const score = attempt.questionIds.length === 0 ? 0 : correctCount / attempt.questionIds.length;
    const passed = score >= Number(attempt.quiz.passThreshold);

    await this.prisma.$transaction([
      ...results.map((r) =>
        this.prisma.quizAttemptAnswer.create({
          data: {
            attemptId: attempt.id,
            questionId: r.questionId,
            answer: r.answer ?? {},
            isCorrect: r.isCorrect,
          },
        }),
      ),
      this.prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { submittedAt: new Date(), score, passed },
      }),
    ]);

    if (passed) {
      await this.progress.markQuizPassed(userId, attempt.quiz.lessonId);
    }

    return {
      score,
      passed,
      results: results.map((r) => {
        const question = questionById.get(r.questionId);
        const key = question?.answerKey as { correct: string | string[] } | undefined;
        const correctAnswer = key?.correct;
        return {
          questionId: r.questionId,
          correct: r.isCorrect,
          correctAnswer: Array.isArray(correctAnswer) ? correctAnswer.join(", ") : (correctAnswer ?? null),
          explanationCdnPath: r.explanationCdnPath,
        };
      }),
    };
  }

  async practicePool(userId: string, quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { where: { active: true } } },
    });
    if (!quiz) {
      throw new NotFoundException({ error: { code: "QUIZ_NOT_FOUND", message: "Quiz not found." } });
    }
    const passed = await this.prisma.quizAttempt.findFirst({ where: { userId, quizId, passed: true } });
    if (!passed) {
      throw new ForbiddenException({
        error: { code: "QUIZ_NOT_PASSED", message: "Practice-more mode unlocks after passing the quiz." },
      });
    }
    return {
      questions: quiz.questions.map((q) => ({
        id: q.id,
        qtype: q.qtype as StartAttemptResponse["questions"][number]["qtype"],
        difficulty: q.difficulty as StartAttemptResponse["questions"][number]["difficulty"],
        payloadCdnPath: q.payloadCdnPath,
      })),
    };
  }
}

export function gradeAnswer(qtype: string, answerKey: unknown, answer: string | string[] | undefined): boolean {
  if (answer === undefined) return false;
  const key = answerKey as { correct: string | string[] };

  if (qtype === "order_steps") {
    // Sequence matters — unlike `multi`, where selection order is irrelevant.
    if (!Array.isArray(answer) || !Array.isArray(key.correct)) return false;
    return answer.length === key.correct.length && answer.every((v, i) => v === key.correct[i]);
  }

  if (Array.isArray(key.correct)) {
    if (!Array.isArray(answer)) return false;
    const a = [...answer].sort();
    const b = [...key.correct].sort();
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }
  return typeof answer === "string" && answer.trim().toLowerCase() === key.correct.trim().toLowerCase();
}

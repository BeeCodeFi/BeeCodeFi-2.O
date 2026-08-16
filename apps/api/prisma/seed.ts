import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CDN_BASE = "/content/html/getting-started/basic-syntax-rules";

const QUESTIONS: Array<{
  externalId: string;
  qtype: string;
  difficulty: string;
  correct: string | string[];
}> = [
  { externalId: "q1", qtype: "mcq", difficulty: "easy", correct: "</p>" },
  { externalId: "q2", qtype: "mcq", difficulty: "easy", correct: "An attribute" },
  { externalId: "q3", qtype: "mcq", difficulty: "easy", correct: "<img>" },
  { externalId: "q4", qtype: "fill_blank", difficulty: "easy", correct: "</h1>" },
  { externalId: "q5", qtype: "multi", difficulty: "medium", correct: ["br", "hr", "img", "input"] },
  { externalId: "q6", qtype: "mcq", difficulty: "easy", correct: "Wrapped in quotes" },
  {
    externalId: "q7",
    qtype: "fix_code",
    difficulty: "medium",
    correct: "The closing tag should be </p>, not another <p>",
  },
  { externalId: "q8", qtype: "fix_code", difficulty: "medium", correct: "B" },
  {
    externalId: "q9",
    qtype: "order_steps",
    difficulty: "hard",
    correct: ["<div>", "<p>", "</p>", "</div>"],
  },
  { externalId: "q10", qtype: "mcq", difficulty: "medium", correct: "Zero, one, or many" },
  { externalId: "q11", qtype: "fill_blank", difficulty: "medium", correct: "void" },
  {
    externalId: "q12",
    qtype: "mcq",
    difficulty: "hard",
    correct: "The browser usually tries to recover silently, which can hide bugs",
  },
];

const SECTIONS = [
  { anchor: "what-is-an-element", orderIndex: 0, minDwellSeconds: 15 },
  { anchor: "opening-closing-tags", orderIndex: 1, minDwellSeconds: 15 },
  { anchor: "attributes", orderIndex: 2, minDwellSeconds: 15 },
  { anchor: "nesting-rules", orderIndex: 3, minDwellSeconds: 15 },
  { anchor: "void-elements", orderIndex: 4, minDwellSeconds: 15 },
];

async function main() {
  const course = await prisma.course.upsert({
    where: { slug: "html" },
    create: {
      slug: "html",
      title: "HTML",
      description: "Absolute beginner to confident, semantic, accessible HTML author.",
      status: "published",
      orderIndex: 0,
    },
    update: { status: "published" },
  });

  const module_ = await prisma.module.upsert({
    where: { courseId_slug: { courseId: course.id, slug: "getting-started" } },
    create: {
      courseId: course.id,
      slug: "getting-started",
      title: "Getting Started",
      orderIndex: 0,
    },
    update: {},
  });

  const lesson = await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: module_.id, slug: "basic-syntax-rules" } },
    create: {
      moduleId: module_.id,
      slug: "basic-syntax-rules",
      title: "Basic Syntax Rules",
      orderIndex: 0,
      cdnPath: CDN_BASE,
      estReadMinutes: 6,
    },
    update: { cdnPath: CDN_BASE },
  });

  await prisma.lessonSection.deleteMany({ where: { lessonId: lesson.id } });
  await prisma.lessonSection.createMany({
    data: SECTIONS.map((s) => ({ ...s, lessonId: lesson.id })),
  });

  const quiz = await prisma.quiz.upsert({
    where: { lessonId: lesson.id },
    create: {
      lessonId: lesson.id,
      questionsServed: 8,
      passThreshold: 0.8,
      maxAttempts: null,
    },
    update: { questionsServed: 8, passThreshold: 0.8 },
  });

  for (const q of QUESTIONS) {
    await prisma.quizQuestion.upsert({
      where: { externalId: q.externalId },
      create: {
        quizId: quiz.id,
        externalId: q.externalId,
        qtype: q.qtype,
        difficulty: q.difficulty,
        payloadCdnPath: `${CDN_BASE}/quiz/${q.externalId}.json`,
        answerKey: { correct: q.correct },
        explanationCdnPath: `${CDN_BASE}/quiz/explanations.json#${q.externalId}`,
      },
      update: {
        qtype: q.qtype,
        difficulty: q.difficulty,
        answerKey: { correct: q.correct },
      },
    });
  }

  await prisma.practiceTask.upsert({
    where: { lessonId: lesson.id },
    create: {
      lessonId: lesson.id,
      title: "8 elements, done right",
      briefCdnPath: `${CDN_BASE}/task-brief.md`,
      starterCodeCdnPath: `${CDN_BASE}/starter.json`,
      starterCode: {
        html:
          "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>My practice page</title>\n  </head>\n  <body>\n    <!-- Try adding a heading, a paragraph, and a link below -->\n  </body>\n</html>\n",
        css: "",
        js: "",
      },
      rubric: {
        requiredElements: ["html", "head", "title", "body", "h1", "p", "img[alt]", "a[href]"],
        forbidden: ["table"],
        minLines: 15,
      },
      requiresUpload: true,
      githubPathTemplate: "lessons/getting-started/basic-syntax-rules/",
    },
    update: {},
  });

  console.log("Seeded golden fixture lesson:", lesson.slug);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONTENT_ROOT = "/content/html/getting-started";

interface QuestionDef {
  externalId: string;
  qtype: string;
  difficulty: string;
  correct: string | string[];
}

interface SectionDef {
  anchor: string;
  orderIndex: number;
  minDwellSeconds: number;
}

interface TaskDef {
  title: string;
  starterCode: { html: string; css: string; js: string };
  rubric: { requiredElements: string[]; forbidden: string[]; minLines: number };
  requiresUpload?: boolean;
}

interface LessonDef {
  slug: string;
  title: string;
  orderIndex: number;
  estReadMinutes: number;
  sections: SectionDef[];
  quizQuestionsServed: number;
  questions: QuestionDef[];
  task: TaskDef;
}

const LESSONS: LessonDef[] = [
  {
    slug: "what-html-is",
    title: "What HTML Is & How the Web Works",
    orderIndex: 0,
    estReadMinutes: 6,
    sections: [
      { anchor: "what-is-html", orderIndex: 0, minDwellSeconds: 12 },
      { anchor: "client-server-and-requests", orderIndex: 1, minDwellSeconds: 14 },
      { anchor: "how-browsers-render-html", orderIndex: 2, minDwellSeconds: 14 },
      { anchor: "the-dom", orderIndex: 3, minDwellSeconds: 12 },
      { anchor: "urls-and-links-preview", orderIndex: 4, minDwellSeconds: 10 },
    ],
    quizQuestionsServed: 8,
    questions: [
      { externalId: "q1", qtype: "mcq", difficulty: "easy", correct: "A markup language" },
      {
        externalId: "q2",
        qtype: "mcq",
        difficulty: "easy",
        correct: "It translates a domain name into an IP address",
      },
      { externalId: "q3", qtype: "mcq", difficulty: "medium", correct: "An HTTP request" },
      { externalId: "q4", qtype: "multi", difficulty: "easy", correct: ["scheme", "domain", "path"] },
      {
        externalId: "q5",
        qtype: "multi",
        difficulty: "medium",
        correct: [
          "The browser parses HTML from top to bottom",
          "Linked CSS and image files can be requested while the rest of the HTML is still being parsed",
          "The DOM is built while the browser parses the HTML",
        ],
      },
      { externalId: "q6", qtype: "fill_blank", difficulty: "easy", correct: "client" },
      { externalId: "q7", qtype: "fill_blank", difficulty: "medium", correct: "DOM" },
      {
        externalId: "q8",
        qtype: "fix_code",
        difficulty: "medium",
        correct:
          "The DOM is a live tree the browser builds from the HTML, and JavaScript can change it without touching the original file",
      },
      {
        externalId: "q9",
        qtype: "fix_code",
        difficulty: "hard",
        correct:
          "A URL — and therefore an href — can include a scheme and domain as well as a path; a path alone is only one valid form",
      },
      {
        externalId: "q10",
        qtype: "order_steps",
        difficulty: "hard",
        correct: [
          "You enter a URL in the browser",
          "The browser looks up the domain via DNS",
          "The browser sends an HTTP request to the server",
          "The server sends back an HTML response",
          "The browser parses the HTML and renders the page",
        ],
      },
    ],
    task: {
      title: "Hello Web",
      starterCode: {
        html:
          '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My practice page</title>\n  </head>\n  <body>\n    <!-- Add your h1 heading and a paragraph below -->\n  </body>\n</html>\n',
        css: "",
        js: "",
      },
      rubric: { requiredElements: ["title", "h1", "p"], forbidden: ["a", "img", "table"], minLines: 8 },
    },
  },
  {
    slug: "document-structure",
    title: "Document Structure",
    orderIndex: 1,
    estReadMinutes: 6,
    sections: [
      { anchor: "the-doctype", orderIndex: 0, minDwellSeconds: 12 },
      { anchor: "html-element-and-lang", orderIndex: 1, minDwellSeconds: 12 },
      { anchor: "head-element", orderIndex: 2, minDwellSeconds: 15 },
      { anchor: "body-element", orderIndex: 3, minDwellSeconds: 10 },
      { anchor: "why-structure-matters", orderIndex: 4, minDwellSeconds: 12 },
    ],
    quizQuestionsServed: 8,
    questions: [
      { externalId: "q1", qtype: "mcq", difficulty: "easy", correct: "<!DOCTYPE html>" },
      {
        externalId: "q2",
        qtype: "mcq",
        difficulty: "easy",
        correct: "Render the page in standards mode instead of quirks mode",
      },
      { externalId: "q3", qtype: "fill_blank", difficulty: "easy", correct: "lang" },
      {
        externalId: "q4",
        qtype: "multi",
        difficulty: "easy",
        correct: ["title", "meta charset", "link (for CSS)"],
      },
      { externalId: "q5", qtype: "mcq", difficulty: "medium", correct: "Exactly one" },
      { externalId: "q6", qtype: "fill_blank", difficulty: "medium", correct: "UTF-8" },
      {
        externalId: "q7",
        qtype: "fix_code",
        difficulty: "medium",
        correct: "The visible <h1> shouldn't be inside <head> — it belongs in <body>",
      },
      {
        externalId: "q8",
        qtype: "multi",
        difficulty: "medium",
        correct: [
          "Screen readers may mispronounce the content",
          "Translation tools may guess the wrong source language",
          "Search engines may serve the page to the wrong audience",
        ],
      },
      {
        externalId: "q9",
        qtype: "order_steps",
        difficulty: "hard",
        correct: ["<!DOCTYPE html>", "<html>", "<head>", "<body>"],
      },
      {
        externalId: "q10",
        qtype: "fix_code",
        difficulty: "hard",
        correct:
          "The browser is lenient and typically merges the content into a single rendered body, hiding the mistake",
      },
    ],
    task: {
      title: "The boilerplate, from memory",
      starterCode: {
        html: "<!-- Reproduce the standard HTML boilerplate from memory below -->\n<html>\n</html>\n",
        css: "",
        js: "",
      },
      rubric: {
        requiredElements: ["html[lang]", "head", "meta[charset]", "title", "body"],
        forbidden: [],
        minLines: 8,
      },
    },
  },
  {
    slug: "basic-syntax-rules",
    title: "Basic Syntax Rules",
    orderIndex: 2,
    estReadMinutes: 6,
    sections: [
      { anchor: "what-is-an-element", orderIndex: 0, minDwellSeconds: 15 },
      { anchor: "opening-closing-tags", orderIndex: 1, minDwellSeconds: 15 },
      { anchor: "attributes", orderIndex: 2, minDwellSeconds: 15 },
      { anchor: "nesting-rules", orderIndex: 3, minDwellSeconds: 15 },
      { anchor: "void-elements", orderIndex: 4, minDwellSeconds: 15 },
    ],
    quizQuestionsServed: 8,
    questions: [
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
    ],
    task: {
      title: "8 elements, done right",
      starterCode: {
        html:
          '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My practice page</title>\n  </head>\n  <body>\n    <!-- Try adding a heading, a paragraph, and a link below -->\n  </body>\n</html>\n',
        css: "",
        js: "",
      },
      rubric: {
        requiredElements: ["html", "head", "title", "body", "h1", "p", "img[alt]", "a[href]"],
        forbidden: ["table"],
        minLines: 15,
      },
      requiresUpload: true,
    },
  },
  {
    slug: "comments-and-entities",
    title: "Comments & HTML Entities",
    orderIndex: 3,
    estReadMinutes: 6,
    sections: [
      { anchor: "html-comments", orderIndex: 0, minDwellSeconds: 12 },
      { anchor: "why-entities-exist", orderIndex: 1, minDwellSeconds: 10 },
      { anchor: "common-entities", orderIndex: 2, minDwellSeconds: 12 },
      { anchor: "escaping-reserved-characters", orderIndex: 3, minDwellSeconds: 14 },
      { anchor: "whitespace-entities", orderIndex: 4, minDwellSeconds: 12 },
    ],
    quizQuestionsServed: 8,
    questions: [
      { externalId: "q1", qtype: "mcq", difficulty: "easy", correct: "<!-- and -->" },
      { externalId: "q2", qtype: "mcq", difficulty: "easy", correct: "@" },
      { externalId: "q3", qtype: "mcq", difficulty: "medium", correct: "A non-breaking space" },
      { externalId: "q4", qtype: "fill_blank", difficulty: "easy", correct: "&amp;" },
      { externalId: "q5", qtype: "multi", difficulty: "medium", correct: ["&lt;", "&gt;", "&amp;", "&copy;"] },
      { externalId: "q6", qtype: "fix_code", difficulty: "medium", correct: "Comments can't be nested" },
      { externalId: "q7", qtype: "order_steps", difficulty: "medium", correct: ["<!--", "Hello", "-->"] },
      {
        externalId: "q8",
        qtype: "multi",
        difficulty: "hard",
        correct: [
          "A raw & in text content can be misinterpreted as the start of an entity",
          "Regular spaces in HTML text collapse to a single space when rendered",
          "&nbsp; prevents a line break at that position",
        ],
      },
      { externalId: "q9", qtype: "fill_blank", difficulty: "hard", correct: "collapse" },
      {
        externalId: "q10",
        qtype: "fix_code",
        difficulty: "easy",
        correct: "The < and > should be escaped as &lt; and &gt;",
      },
    ],
    task: {
      title: "Entity cheatsheet",
      starterCode: {
        html:
          '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Entity cheatsheet</title>\n  </head>\n  <body>\n    <!-- Add your entity examples below, one per line -->\n  </body>\n</html>\n',
        css: "",
        js: "",
      },
      rubric: { requiredElements: ["html", "head", "title", "body", "h1"], forbidden: [], minLines: 10 },
    },
  },
  {
    slug: "boilerplate-and-meta",
    title: "HTML Boilerplate & Meta Tags",
    orderIndex: 4,
    estReadMinutes: 6,
    sections: [
      { anchor: "the-standard-boilerplate", orderIndex: 0, minDwellSeconds: 10 },
      { anchor: "charset-meta", orderIndex: 1, minDwellSeconds: 12 },
      { anchor: "viewport-meta", orderIndex: 2, minDwellSeconds: 14 },
      { anchor: "description-and-seo-meta", orderIndex: 3, minDwellSeconds: 14 },
      { anchor: "favicon-link", orderIndex: 4, minDwellSeconds: 10 },
    ],
    quizQuestionsServed: 8,
    questions: [
      { externalId: "q1", qtype: "mcq", difficulty: "easy", correct: '<meta charset="UTF-8">' },
      {
        externalId: "q2",
        qtype: "mcq",
        difficulty: "easy",
        correct: "Special characters or emoji render as garbled symbols",
      },
      { externalId: "q3", qtype: "fill_blank", difficulty: "easy", correct: "scale" },
      { externalId: "q4", qtype: "mcq", difficulty: "easy", correct: "False" },
      {
        externalId: "q5",
        qtype: "multi",
        difficulty: "medium",
        correct: [
          "Sets the page width to match the device's screen width",
          "Sets the initial zoom level",
          "Prevents mobile browsers from forcing a zoomed-out desktop view",
        ],
      },
      {
        externalId: "q6",
        qtype: "mcq",
        difficulty: "medium",
        correct: "The snippet text shown under the title in search results",
      },
      {
        externalId: "q7",
        qtype: "multi",
        difficulty: "medium",
        correct: [
          "A good description is a plain-language summary of the page",
          "Search engines may rewrite or replace it with different snippet text",
        ],
      },
      { externalId: "q8", qtype: "fill_blank", difficulty: "medium", correct: "icon" },
      {
        externalId: "q9",
        qtype: "fix_code",
        difficulty: "hard",
        correct: 'The <meta charset="UTF-8"> declaration is missing',
      },
      {
        externalId: "q10",
        qtype: "order_steps",
        difficulty: "hard",
        correct: [
          '<meta charset="UTF-8">',
          '<meta name="viewport" content="width=device-width, initial-scale=1">',
          "<title>My Page</title>",
          '<meta name="description" content="...">',
        ],
      },
    ],
    task: {
      title: "A fully-tagged head",
      starterCode: {
        html:
          '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <title>My portfolio</title>\n  </head>\n  <body>\n    <!-- The <head> above is missing most of its meta tags. Add them below. -->\n  </body>\n</html>\n',
        css: "",
        js: "",
      },
      rubric: {
        requiredElements: [
          "html[lang]",
          "meta[charset=UTF-8]",
          "meta[name=viewport]",
          "title",
          "meta[name=description]",
          "link[rel=icon]",
          "h1",
          "p",
        ],
        forbidden: [],
        minLines: 10,
      },
    },
  },
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

  for (const def of LESSONS) {
    const cdnPath = `${CONTENT_ROOT}/${def.slug}`;

    const lesson = await prisma.lesson.upsert({
      where: { moduleId_slug: { moduleId: module_.id, slug: def.slug } },
      create: {
        moduleId: module_.id,
        slug: def.slug,
        title: def.title,
        orderIndex: def.orderIndex,
        cdnPath,
        estReadMinutes: def.estReadMinutes,
      },
      update: {
        title: def.title,
        orderIndex: def.orderIndex,
        cdnPath,
        estReadMinutes: def.estReadMinutes,
      },
    });

    await prisma.lessonSection.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.lessonSection.createMany({
      data: def.sections.map((s) => ({ ...s, lessonId: lesson.id })),
    });

    const quiz = await prisma.quiz.upsert({
      where: { lessonId: lesson.id },
      create: {
        lessonId: lesson.id,
        questionsServed: def.quizQuestionsServed,
        passThreshold: 0.8,
        maxAttempts: null,
      },
      update: { questionsServed: def.quizQuestionsServed, passThreshold: 0.8 },
    });

    // `external_id` is globally unique across all quizzes, but question ids
    // (q1..q10) repeat per lesson — delete-and-recreate per quiz instead of
    // upserting by external_id, which would leave stale duplicates behind.
    await prisma.quizQuestion.deleteMany({ where: { quizId: quiz.id } });
    await prisma.quizQuestion.createMany({
      data: def.questions.map((q) => ({
        quizId: quiz.id,
        externalId: `${def.slug}-${q.externalId}`,
        qtype: q.qtype,
        difficulty: q.difficulty,
        payloadCdnPath: `${cdnPath}/quiz/${q.externalId}.json`,
        answerKey: { correct: q.correct },
        explanationCdnPath: `${cdnPath}/quiz/explanations.json#${q.externalId}`,
      })),
    });

    await prisma.practiceTask.upsert({
      where: { lessonId: lesson.id },
      create: {
        lessonId: lesson.id,
        title: def.task.title,
        briefCdnPath: `${cdnPath}/task-brief.md`,
        starterCodeCdnPath: `${cdnPath}/starter.json`,
        starterCode: def.task.starterCode,
        rubric: def.task.rubric,
        requiresUpload: def.task.requiresUpload ?? true,
        githubPathTemplate: `lessons/getting-started/${def.slug}/`,
      },
      update: {
        title: def.task.title,
        starterCode: def.task.starterCode,
        rubric: def.task.rubric,
      },
    });

    console.log("Seeded lesson:", def.slug);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

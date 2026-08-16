import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONTENT_ROOT = "/content/html/foundations";

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
      { externalId: "q1", qtype: "mcq", difficulty: "medium", correct: "No — it is a markup language that describes structure and meaning" },
      { externalId: "q2", qtype: "mcq", difficulty: "medium", correct: "Structuring content and giving it semantic meaning" },
      { externalId: "q3", qtype: "mcq", difficulty: "medium", correct: "WHATWG" },
      { externalId: "q4", qtype: "mcq", difficulty: "medium", correct: "Browser sends request → Server responds with HTML → Browser parses HTML and builds DOM → Browser paints page" },
      { externalId: "q5", qtype: "mcq", difficulty: "medium", correct: "Hyper Text Markup Language" },
      { externalId: "q6", qtype: "mcq", difficulty: "medium", correct: "An in-memory tree the browser builds from HTML, manipulable by JavaScript" },
      { externalId: "q7", qtype: "mcq", difficulty: "medium", correct: "Adding complex interactivity and logic" },
      { externalId: "q8", qtype: "mcq", difficulty: "medium", correct: "False — HTML describes structure; CSS handles visual presentation" },
      { externalId: "q9", qtype: "mcq", difficulty: "medium", correct: "It identifies the location of a resource on the web for the browser to fetch" },
      { externalId: "q10", qtype: "mcq", difficulty: "medium", correct: "2014 — when HTML5 became a W3C Recommendation" }
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
      { externalId: "q1", qtype: "mcq", difficulty: "medium", correct: "Render the page in standards mode" },
      { externalId: "q2", qtype: "mcq", difficulty: "medium", correct: "No — it is not an HTML element" },
      { externalId: "q3", qtype: "mcq", difficulty: "medium", correct: "<head>" },
      { externalId: "q4", qtype: "mcq", difficulty: "medium", correct: "One" },
      { externalId: "q5", qtype: "mcq", difficulty: "medium", correct: "html → head → body" },
      { externalId: "q6", qtype: "mcq", difficulty: "medium", correct: "The browser switches to quirks mode" },
      { externalId: "q7", qtype: "mcq", difficulty: "medium", correct: "Sets the browser tab text and search-result title" },
      { externalId: "q8", qtype: "mcq", difficulty: "medium", correct: "Visible and interactive content" },
      { externalId: "q9", qtype: "mcq", difficulty: "medium", correct: "Browsers silently move it to <body> or ignore it" },
      { externalId: "q10", qtype: "mcq", difficulty: "medium", correct: "It causes inconsistent rendering and box-model behaviour" }
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
      { externalId: "q1", qtype: "mcq", difficulty: "medium", correct: "Opening tag, content, and closing tag" },
      { externalId: "q2", qtype: "mcq", difficulty: "medium", correct: "<img>" },
      { externalId: "q3", qtype: "mcq", difficulty: "medium", correct: "Inside the opening tag" },
      { externalId: "q4", qtype: "mcq", difficulty: "medium", correct: "An attribute whose mere presence means true" },
      { externalId: "q5", qtype: "mcq", difficulty: "medium", correct: "Children must be closed before their parent is closed" },
      { externalId: "q6", qtype: "mcq", difficulty: "medium", correct: "Browsers usually recover silently, hiding the bug" },
      { externalId: "q7", qtype: "mcq", difficulty: "medium", correct: "Wrapped in double or single quotes" },
      { externalId: "q8", qtype: "mcq", difficulty: "medium", correct: "Tag = the angle-bracket marker; element = opening tag + content + closing tag" },
      { externalId: "q9", qtype: "mcq", difficulty: "medium", correct: "Zero, one, or many" },
      { externalId: "q10", qtype: "mcq", difficulty: "medium", correct: "Optional and purely stylistic" }
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
      { externalId: "q1", qtype: "mcq", difficulty: "medium", correct: "<!-- comment -->" },
      { externalId: "q2", qtype: "mcq", difficulty: "medium", correct: "< and > and &" },
      { externalId: "q3", qtype: "mcq", difficulty: "medium", correct: "A copyright symbol ©" },
      { externalId: "q4", qtype: "mcq", difficulty: "medium", correct: "A non-breaking space" },
      { externalId: "q5", qtype: "mcq", difficulty: "medium", correct: "An ampersand &" },
      { externalId: "q6", qtype: "mcq", difficulty: "medium", correct: "No — nested comments break parsing" },
      { externalId: "q7", qtype: "mcq", difficulty: "medium", correct: "They collapse to a single space" },
      { externalId: "q8", qtype: "mcq", difficulty: "medium", correct: "No — but they ARE visible in page source" },
      { externalId: "q9", qtype: "mcq", difficulty: "medium", correct: "&#60;" },
      { externalId: "q10", qtype: "mcq", difficulty: "medium", correct: "To prevent the browser from interpreting them as tag markers" }
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
      { externalId: "q1", qtype: "mcq", difficulty: "medium", correct: "<meta charset=\"UTF-8\">" },
      { externalId: "q2", qtype: "mcq", difficulty: "medium", correct: "Emoji display as question marks or garbled symbols" },
      { externalId: "q3", qtype: "mcq", difficulty: "medium", correct: "Matches the CSS viewport width to the physical device width and sets 1× zoom" },
      { externalId: "q4", qtype: "mcq", difficulty: "medium", correct: "The snippet text shown under the title in search results" },
      { externalId: "q5", qtype: "mcq", difficulty: "medium", correct: "Yes — they often substitute their own snippet if they think it fits better" },
      { externalId: "q6", qtype: "mcq", difficulty: "medium", correct: "<link rel=\"icon\" href=\"/favicon.ico\">" },
      { externalId: "q7", qtype: "mcq", difficulty: "medium", correct: "<title> sets the browser-tab text; <h1> is the visible on-page heading" },
      { externalId: "q8", qtype: "mcq", difficulty: "medium", correct: "To avoid encoding issues and re-parsing before other text is read" },
      { externalId: "q9", qtype: "mcq", difficulty: "medium", correct: "Virtually all characters and emoji from all languages" },
      { externalId: "q10", qtype: "mcq", difficulty: "medium", correct: "It prevents mobile browsers from forcing a zoomed-out desktop view" }
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
  {
    slug: "language-and-internationalization",
    title: "Language & Internationalization Basics",
    orderIndex: 5,
    estReadMinutes: 6,
    sections: [
      { anchor: "why-language-matters", orderIndex: 0, minDwellSeconds: 10 },
      { anchor: "the-lang-attribute", orderIndex: 1, minDwellSeconds: 14 },
      { anchor: "the-dir-attribute-and-rtl", orderIndex: 2, minDwellSeconds: 14 },
      { anchor: "charset-and-unicode", orderIndex: 3, minDwellSeconds: 12 },
      { anchor: "practical-i18n-tips", orderIndex: 4, minDwellSeconds: 12 },
    ],
    quizQuestionsServed: 8,
    questions: [
      { externalId: "q1", qtype: "mcq", difficulty: "medium", correct: "The human (natural) language of the page" },
      { externalId: "q2", qtype: "mcq", difficulty: "medium", correct: "On the <html> root element" },
      { externalId: "q3", qtype: "mcq", difficulty: "medium", correct: "dir" },
      { externalId: "q4", qtype: "mcq", difficulty: "medium", correct: "When a section of the page is in a different language or direction" },
      { externalId: "q5", qtype: "mcq", difficulty: "medium", correct: "Arabic and Hebrew" },
      { externalId: "q6", qtype: "mcq", difficulty: "medium", correct: "A standardised string like \"en-US\" or \"fr\" identifying a language and optional region" },
      { externalId: "q7", qtype: "mcq", difficulty: "medium", correct: "It selects the correct pronunciation engine for the language" },
      { externalId: "q8", qtype: "mcq", difficulty: "medium", correct: "It can flip margins, padding, and flex/grid direction" },
      { externalId: "q9", qtype: "mcq", difficulty: "medium", correct: "To tell search engines about alternate-language versions of the page" },
      { externalId: "q10", qtype: "mcq", difficulty: "medium", correct: "Screen readers may mispronounce content; translation tools may guess wrong" }
    ],
    task: {
      title: "Bilingual page with correct lang & dir",
      starterCode: {
        html:
          '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8" />\n    <title>Bilingual Page</title>\n  </head>\n  <body>\n    <!-- Add the correct lang attribute to <html> above -->\n    <h1>Hello, World!</h1>\n    <!-- Add an Arabic greeting below with correct lang and dir -->\n  </body>\n</html>\n',
        css: "",
        js: "",
      },
      rubric: {
        requiredElements: [
          "html[lang]",
          "meta[charset=UTF-8]",
          "h1",
          "p",
        ],
        forbidden: [],
        minLines: 12,
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

  // Clean up the legacy "getting-started" module slug if it still exists, to
  // avoid duplicate external_id constraint violations when re-seeding.
  const legacyModule = await prisma.module.findUnique({
    where: { courseId_slug: { courseId: course.id, slug: "getting-started" } },
    include: { lessons: { include: { quiz: { include: { questions: true } } } } },
  });
  if (legacyModule) {
    for (const lesson of legacyModule.lessons) {
      if (lesson.quiz) {
        await prisma.quizQuestion.deleteMany({ where: { quizId: lesson.quiz.id } });
        await prisma.quiz.delete({ where: { id: lesson.quiz.id } });
      }
      await prisma.lessonSection.deleteMany({ where: { lessonId: lesson.id } });
      await prisma.practiceTask.deleteMany({ where: { lessonId: lesson.id } });
      await prisma.lesson.delete({ where: { id: lesson.id } });
    }
    await prisma.module.delete({ where: { id: legacyModule.id } });
    console.log("Cleaned up legacy 'getting-started' module.");
  }

  const HTML_MODULES = [
    { slug: "foundations", title: "Foundations" },
    { slug: "text-content", title: "Text Content" },
    { slug: "media-and-embedded-content", title: "Media & Embedded Content" },
    { slug: "structure-and-semantics", title: "Structure & Semantics" },
    { slug: "tables", title: "Tables" },
    { slug: "forms", title: "Forms" },
    { slug: "attributes-and-metadata-deep-dive", title: "Attributes & Metadata Deep Dive" },
    { slug: "accessibility-a11y", title: "Accessibility (A11y)" },
    { slug: "html5-apis-and-advanced-features", title: "HTML5 APIs & Advanced Features" },
    { slug: "best-practices-and-real-world-practice", title: "Best Practices & Real-World Practice" }
  ];

  const modulesMap = new Map<string, { id: string }>();
  for (const [i, modData] of HTML_MODULES.entries()) {
    const mod = await prisma.module.upsert({
      where: { courseId_slug: { courseId: course.id, slug: modData.slug } },
      create: {
        courseId: course.id,
        slug: modData.slug,
        title: modData.title,
        orderIndex: i,
      },
      update: { title: modData.title, orderIndex: i },
    });
    modulesMap.set(mod.slug, mod);
  }

  const module_ = modulesMap.get("foundations")!;

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
        githubPathTemplate: `lessons/foundations/${def.slug}/`,
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

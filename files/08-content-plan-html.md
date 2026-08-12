# 08 — Content Plan: HTML Course (Course #1)

Slug: `html` · Repo folder: `beecodefi-html` · Target: absolute beginner → confident, semantic, accessible HTML author.

## Authoring format (content repo `beecodefi-content`)

```
courses/html/
  course.yaml                       # title, order, modules list
  01-getting-started/
    module.yaml
    01-what-is-html/
      lesson.mdx                    # sections marked with {#anchors}
      starter/ index.html
      quiz.yaml                     # full pool with answers + explanations
      task.yaml                     # brief, rubric, github_path_template
```

CI validates against JSON Schemas (question types, rubric keys), then syncs metadata + answer keys to DB and bundles MDX/starter/question payloads to CDN (`02 §4`).

## Curriculum (7 modules, 32 lessons)

Quiz sizing: **served / pool** per lesson; heavier concepts get bigger pools. Every lesson ends with a build task pushed to `lessons/{module}/{lesson}/`.

### Module 1 — Getting Started (4 lessons)
| # | Lesson | Quiz (served/pool) | Build task |
|---|---|---|---|
| 1 | What is HTML & how the web works | 15/35 | "Hello Web" page with title + paragraph about yourself |
| 2 | Document anatomy: doctype, html, head, body | 15/35 | Correctly structured boilerplate from memory |
| 3 | Elements, tags, attributes | 20/45 | Page using 8 different elements with attributes |
| 4 | Comments, whitespace, nesting rules | 15/30 | Fix a broken nested document (given messy starter) |

### Module 2 — Text & Structure (5 lessons)
| 5 | Headings & paragraphs (hierarchy) | 15/35 | Article page with proper h1–h3 outline |
| 6 | Text semantics: strong, em, mark, small, sub/sup, abbr | 20/40 | Glossary page using ≥6 inline semantic elements |
| 7 | Lists: ul, ol, dl, nesting | 20/40 | Recipe page (ingredients ul, steps ol, terms dl) |
| 8 | Quotes & code: blockquote, q, cite, pre, code, kbd | 15/30 | "Favorite quotes + a code snippet" page |
| 9 | Links deep-dive: href schemes, targets, fragments, download | 25/50 | Personal links hub with section anchors |

### Module 3 — Media (4 lessons)
| 10 | Images: img, alt (properly!), width/height, formats | 20/45 | Photo gallery with meaningful alt text |
| 11 | figure/figcaption, picture, srcset (responsive images) | 20/40 | Responsive hero image demo |
| 12 | Audio & video elements, tracks/captions | 15/30 | Mini media page with controls + captions file |
| 13 | Iframes & embedding safely | 15/30 | Page embedding a map + sandboxed frame |

### Module 4 — Tables (3 lessons)
| 14 | Table basics: table, tr, td, th | 15/35 | Class timetable |
| 15 | Structure: thead/tbody/tfoot, caption, col | 15/30 | Product price table with caption |
| 16 | Spanning & accessible tables (scope, headers) | 20/40 | Complex report table, screen-reader-correct |

### Module 5 — Forms ⭐ (6 lessons — heaviest module)
| 17 | form, action, method; label ↔ input pairing | 20/45 | Contact form (labels required by rubric) |
| 18 | Input types tour (text, email, number, date, color…) | 25/55 | "Every input" showcase form |
| 19 | Selects, datalist, textarea, fieldset/legend | 20/45 | Survey form with grouped sections |
| 20 | Checkboxes, radios, buttons | 20/40 | Pizza order form |
| 21 | Built-in validation: required, pattern, min/max | 25/50 | Signup form with full native validation |
| 22 | Form UX & accessibility (autocomplete, aria hints) | 20/40 | Refactor a bad form (given) into an accessible one |

### Module 6 — Semantic & Accessible HTML (5 lessons)
| 23 | Page landmarks: header, nav, main, footer, aside | 20/45 | Re-layout a div-soup page semantically |
| 24 | article vs section vs div (the real rules) | 20/40 | Blog index using correct sectioning |
| 25 | Accessibility fundamentals: alt, headings, focus order | 25/50 | Audit + fix an inaccessible page |
| 26 | ARIA — when NOT to use it, basic roles/labels | 15/35 | Add correct minimal ARIA to a widget markup |
| 27 | Head deep-dive: meta, SEO, Open Graph, favicon | 20/40 | Fully-tagged head for a portfolio page |

### Module 7 — Real-World & Capstone (5 lessons)
| 28 | Entities, symbols, emoji, charset | 15/30 | Cheatsheet page rendering 20 entities |
| 29 | HTML validation & debugging workflow | 15/30 | Fix all validator errors in a broken page |
| 30 | Project structure & multi-page sites (relative paths) | 15/35 | 3-page mini-site with shared nav |
| 31 | Git & GitHub basics (the unblock lesson) | 15/30 | First manual push (or connect + site push) |
| 32 | **Capstone: personal portfolio (HTML-only)** | 30/60 (course-wide review pool) | Multi-page portfolio → pushed as `capstone/`; upload field accepts zip |

**Totals:** ~600 served questions, pool ≈ **1,250 questions** — the "never need another quiz site" budget.

## Per-lesson content spec (definition of done for authors)

- 600–1,200 words, 4–8 anchored sections, ≥3 runnable examples ("Try it" buttons load into the editor).
- 1 inline checkpoint MCQ.
- Quiz pool meets size + difficulty mix (40/40/20) + every question has an explanation.
- Task has machine-checkable rubric + starter + expected-output screenshot.
- Reviewed via content-repo PR by a second author.

## Authoring order (content sprints)

1. Sprint C1: Modules 1–2 (platform beta content)
2. Sprint C2: Module 5 Forms + Module 3 (highest search value)
3. Sprint C3: Modules 4, 6, 7 + capstone

Next courses (same engine, zero engine change): CSS → JavaScript → Git (expanded) → Responsive Design.

# HTML Course Roadmap — 45 Topics Across 10 Modules

Working curriculum for the HTML course content build. Supersedes the topic
list in `08-content-plan-html.md` for planning purposes — once confirmed,
`08` gets reconciled to match (module/lesson counts, quiz sizing, task briefs
per lesson) before authoring begins in earnest.

## Module 1: Foundations
1. What HTML Is & How the Web Works
2. Document Structure (`<!DOCTYPE>`, `<html>`, `<head>`, `<body>`)
3. Basic Syntax Rules (elements, tags, attributes, nesting, void elements)
4. **[NEW]** Comments & HTML Entities/Special Characters (`<!-- -->`, `&amp;`, `&nbsp;`, escaping reserved chars)
5. HTML Boilerplate & Meta Tags (charset, viewport, description)
6. **[NEW]** Language & Internationalization Basics (`lang`, `dir` attributes, RTL text)

## Module 2: Text Content
7. Headings & Paragraphs
8. Text Formatting & Semantics (`<strong>`, `<em>`, `<mark>`, etc.)
9. **[NEW]** Quotations & Citations (`<blockquote>`, `<q>`, `<cite>`, `<abbr>`)
10. **[NEW]** Preformatted & Code-Related Text (`<pre>`, `<code>`, `<kbd>`, `<samp>`, `<var>`)
11. Lists (ordered, unordered, description lists)
12. Links & Anchors (href, target, relative vs absolute, **[NEW] `rel` attribute values** like nofollow/noopener)
13. Line Breaks, Horizontal Rules & Whitespace Handling

## Module 3: Media & Embedded Content
14. Images (`<img>`, alt text, srcset)
15. **[NEW]** `<picture>` Element & Art Direction (responsive image switching)
16. **[NEW]** `<figure>` & `<figcaption>`
17. Audio & Video (`<audio>`, `<video>`, controls, sources, tracks/captions)
18. Embedding Content (`<iframe>`, `<embed>`, `<object>`)

## Module 4: Structure & Semantics
19. Semantic HTML5 Elements (`<header>`, `<footer>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`)
20. Divs & Spans (generic containers vs semantic tags)
21. Document Outline & Accessibility Implications of Structure
22. **[NEW]** Deprecated/Obsolete Elements & Legacy HTML Awareness (`<font>`, `<center>`, why avoid them)

## Module 5: Tables
23. Basic Table Structure (`<table>`, `<tr>`, `<td>`, `<th>`)
24. Table Sections & Advanced Features (`<thead>`, `<tbody>`, `<tfoot>`, colspan/rowspan, `<caption>`)

## Module 6: Forms
25. Form Basics (`<form>`, action, method, GET vs POST)
26. Input Types & Attributes (text, email, number, checkbox, radio, etc.)
27. Other Form Controls (`<select>`, `<textarea>`, `<button>`, `<label>`, `<fieldset>`)
28. **[NEW]** Advanced Form Elements (`<datalist>`, `<output>`, `<progress>`, `<meter>`, `<optgroup>`)
29. Form Validation (HTML5 built-in validation attributes)

## Module 7: Attributes & Metadata Deep Dive
30. Global Attributes (id, class, style, title, data-*, tabindex)
31. `<head>` Deep Dive (favicons, linking CSS/JS, Open Graph basics)
32. **[NEW]** Structured Data Basics (schema.org microdata/JSON-LD as it touches HTML)

## Module 8: Accessibility (A11y)
33. Accessibility Fundamentals (semantic HTML as foundation)
34. ARIA Roles & Attributes (when/how to use, and when NOT to)
35. Accessible Forms & Media (labels, alt text, captions)

## Module 9: HTML5 APIs & Advanced Features
36. Web Storage Basics (conceptual, as it relates to data attributes)
37. `<canvas>` & `<svg>` Basics (inline graphics)
38. `<details>` & `<summary>` (native disclosure widgets)
39. `<template>` & `<slot>`
40. **[NEW]** Custom Elements / Web Components Basics (how `<template>`/`<slot>` fit into the bigger picture)

## Module 10: Best Practices & Real-World Practice
41. HTML Validation & Debugging (W3C validator, common errors, quirks mode)
42. SEO-Relevant HTML (semantic structure, meta tags, heading hierarchy)
43. Performance Considerations (lazy loading, preload/prefetch basics)
44. **[NEW]** Basic Security Awareness in HTML (XSS via unescaped input, safe `<iframe>`/`target="_blank"` practices, CSP meta tag — conceptual, not exploit-focused)
45. Putting It Together — Building a Complete Semantic Page (capstone)

---

**Total: 45 topics across 10 modules**

This is now genuinely end-to-end — including legacy/deprecated awareness,
i18n, security hygiene, and modern responsive/component features that are
easy to overlook.

import { checkRubric } from "./rubric-checker";

const rubric = {
  requiredElements: ["h1", "p", "img[alt]", "a[href]"],
  forbidden: ["table"],
  minLines: 5,
};

const validHtml = `<html>
<head><title>Test</title></head>
<body>
<h1>Title</h1>
<p>Paragraph</p>
<img src="cat.jpg" alt="A cat" />
<a href="https://example.com">Link</a>
</body>
</html>`;

describe("checkRubric", () => {
  it("passes a submission that satisfies every rule", () => {
    const report = checkRubric(validHtml, rubric);
    expect(report.passed).toBe(true);
    expect(report.issues).toHaveLength(0);
  });

  it("flags a missing required element", () => {
    const html = "<html><body><p>only a paragraph</p></body></html>";
    const report = checkRubric(html, rubric);
    expect(report.passed).toBe(false);
    expect(report.issues.some((i) => i.code === "MISSING_ELEMENT")).toBe(true);
  });

  it("does not accept img without a matching alt attribute as satisfying img[alt]", () => {
    const html = `<html><body><h1>T</h1><p>P</p><img src="x.jpg" /><a href="/">l</a></body></html>`;
    const report = checkRubric(html, rubric);
    expect(report.issues.some((i) => i.message.includes("img[alt]"))).toBe(true);
  });

  it("flags a forbidden element even when required elements are present", () => {
    const html = `${validHtml.replace("</body>", "<table></table></body>")}`;
    const report = checkRubric(html, rubric);
    expect(report.issues.some((i) => i.code === "FORBIDDEN_ELEMENT")).toBe(true);
  });

  it("flags submissions shorter than minLines", () => {
    const html = "<h1>Title</h1>";
    const report = checkRubric(html, rubric);
    expect(report.issues.some((i) => i.code === "TOO_SHORT")).toBe(true);
  });
});

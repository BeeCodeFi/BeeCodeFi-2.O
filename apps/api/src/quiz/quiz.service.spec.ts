import { gradeAnswer } from "./quiz.service";

describe("gradeAnswer", () => {
  it("grades mcq case-insensitively, trimmed", () => {
    expect(gradeAnswer("mcq", { correct: "</p>" }, "</p>")).toBe(true);
    expect(gradeAnswer("mcq", { correct: "An attribute" }, " an attribute ")).toBe(true);
    expect(gradeAnswer("mcq", { correct: "An attribute" }, "A tag name")).toBe(false);
  });

  it("grades fill_blank the same way as mcq", () => {
    expect(gradeAnswer("fill_blank", { correct: "void" }, "Void")).toBe(true);
  });

  it("grades multi as an unordered set match", () => {
    const key = { correct: ["br", "hr", "img", "input"] };
    expect(gradeAnswer("multi", key, ["input", "img", "hr", "br"])).toBe(true);
    expect(gradeAnswer("multi", key, ["br", "hr"])).toBe(false);
  });

  it("grades order_steps as an exact sequence match", () => {
    const key = { correct: ["<div>", "<p>", "</p>", "</div>"] };
    expect(gradeAnswer("order_steps", key, ["<div>", "<p>", "</p>", "</div>"])).toBe(true);
    // Same set, wrong order — must fail, unlike `multi`.
    expect(gradeAnswer("order_steps", key, ["<p>", "<div>", "</p>", "</div>"])).toBe(false);
  });

  it("returns false when no answer was submitted", () => {
    expect(gradeAnswer("mcq", { correct: "x" }, undefined)).toBe(false);
  });
});

"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useEditorStore } from "./editor-store";
import type { EditorCode } from "@beecodefi/schemas";

const TABS: Array<{ key: keyof EditorCode; label: string; language: string }> = [
  { key: "html", label: "HTML", language: "html" },
  { key: "css", label: "CSS", language: "css" },
  { key: "js", label: "JS", language: "javascript" },
];

export function CodeEditor() {
  const [activeTab, setActiveTab] = useState<keyof EditorCode>("html");
  const code = useEditorStore((s) => s.code);
  const setCode = useEditorStore((s) => s.setCode);
  const [theme, setTheme] = useState("vs-dark");

  useEffect(() => {
    const isDark = document.documentElement.dataset.theme !== "light";
    setTheme(isDark ? "vs-dark" : "vs");
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1 border-b border-accent/15 bg-surface/60 p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-all duration-150 ${
              activeTab === tab.key
                ? "bg-primary text-bg shadow-soft"
                : "text-text/60 hover:bg-accent/10 hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={TABS.find((t) => t.key === activeTab)!.language}
          theme={theme}
          value={code[activeTab]}
          onChange={(value) => setCode({ [activeTab]: value ?? "" })}
          options={{ minimap: { enabled: false }, fontSize: 13, tabSize: 2 }}
        />
      </div>
    </div>
  );
}

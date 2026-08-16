"use client";

import { useEffect, useRef, useState } from "react";
import type { EditorCode } from "@beecodefi/schemas";

const DEBOUNCE_MS = 400;

function buildSrcDoc(code: EditorCode) {
  return `<!DOCTYPE html><html><head><style>${code.css}</style></head><body>${code.html}<script>${code.js}</script></body></html>`;
}

export function PreviewFrame({ code }: { code: EditorCode }) {
  const [srcDoc, setSrcDoc] = useState(() => buildSrcDoc(code));
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSrcDoc(buildSrcDoc(code)), DEBOUNCE_MS);
    return () => clearTimeout(timer.current);
  }, [code]);

  return (
    <iframe
      title="Live preview"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className="h-full w-full rounded-md border border-accent/20 bg-white"
    />
  );
}

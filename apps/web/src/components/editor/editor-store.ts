import { create } from "zustand";
import type { EditorCode } from "@beecodefi/schemas";

interface EditorStore {
  code: EditorCode;
  starter: EditorCode;
  savedAt: string | null;
  setCode: (code: Partial<EditorCode>) => void;
  reset: () => void;
  hydrate: (code: EditorCode, starter: EditorCode, savedAt: string | null) => void;
  markSaved: (savedAt: string) => void;
}

const EMPTY: EditorCode = { html: "", css: "", js: "" };

export const useEditorStore = create<EditorStore>((set, get) => ({
  code: EMPTY,
  starter: EMPTY,
  savedAt: null,
  setCode: (partial) => set({ code: { ...get().code, ...partial } }),
  reset: () => set({ code: get().starter }),
  hydrate: (code, starter, savedAt) => set({ code, starter, savedAt }),
  markSaved: (savedAt) => set({ savedAt }),
}));

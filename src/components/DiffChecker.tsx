"use client";

import { useState, useMemo, useCallback } from "react";
import { FiDownload, FiCopy, FiCheck } from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";

interface Props {
  locale?: string;
}

type DiffType = "add" | "remove" | "equal";

interface DiffLine {
  type: DiffType;
  text: string;
  origIndex: number | null;  // line number in original (1-based), null for added lines
  modIndex: number | null;   // line number in modified (1-based), null for removed lines
}

// ─── Pure LCS-based diff algorithm (zero dependencies) ───────────────────────

function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  // Use a flat array for performance; index [i][j] = i * (n+1) + j
  const dp = new Int32Array((m + 1) * (n + 1));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i * (n + 1) + j] = 1 + dp[(i + 1) * (n + 1) + (j + 1)];
      } else {
        const down = dp[(i + 1) * (n + 1) + j];
        const right = dp[i * (n + 1) + (j + 1)];
        dp[i * (n + 1) + j] = down > right ? down : right;
      }
    }
  }
  // Convert flat array back to 2D for backtracking
  const table: number[][] = [];
  for (let i = 0; i <= m; i++) {
    table.push(Array.from(dp.subarray(i * (n + 1), (i + 1) * (n + 1))));
  }
  return table;
}

function diffLines(original: string[], modified: string[]): DiffLine[] {
  const table = computeLCS(original, modified);
  const result: DiffLine[] = [];

  let i = 0;
  let j = 0;
  let origLineNum = 1;
  let modLineNum = 1;

  while (i < original.length || j < modified.length) {
    if (i < original.length && j < modified.length && original[i] === modified[j]) {
      result.push({ type: "equal", text: original[i], origIndex: origLineNum, modIndex: modLineNum });
      i++;
      j++;
      origLineNum++;
      modLineNum++;
    } else if (
      j < modified.length &&
      (i >= original.length || table[i + 1][j] >= table[i][j + 1])
    ) {
      result.push({ type: "add", text: modified[j], origIndex: null, modIndex: modLineNum });
      j++;
      modLineNum++;
    } else {
      result.push({ type: "remove", text: original[i], origIndex: origLineNum, modIndex: null });
      i++;
      origLineNum++;
    }
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────

const LINE_LIMIT = 5000;

export default function DiffChecker({ locale = "es" }: Props) {
  const isEs = locale === "es";

  const [original, setOriginal] = useState<string>("");
  const [modified, setModified] = useState<string>("");
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // ─── Compute diff ──────────────────────────────────────────────────────────

  const diffResult = useMemo<DiffLine[] | "too-large" | null>(() => {
    if (!original && !modified) return null;
    const origLines = original.split("\n");
    const modLines = modified.split("\n");
    if (origLines.length > LINE_LIMIT || modLines.length > LINE_LIMIT) {
      return "too-large";
    }
    return diffLines(origLines, modLines);
  }, [original, modified]);

  // ─── Typed diff result ─────────────────────────────────────────────────────

  const isEmpty = !original && !modified;
  const hasDiff = diffResult !== null && diffResult !== "too-large";
  const diffLines2: DiffLine[] | null = hasDiff ? (diffResult as DiffLine[]) : null;

  // ─── Stats ─────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    if (!diffLines2) {
      return { added: 0, removed: 0, unchanged: 0 };
    }
    return diffLines2.reduce(
      (acc, line) => {
        if (line.type === "add") acc.added++;
        else if (line.type === "remove") acc.removed++;
        else acc.unchanged++;
        return acc;
      },
      { added: 0, removed: 0, unchanged: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diffResult]);

  // ─── Download .diff ────────────────────────────────────────────────────────

  const handleDownload = useCallback(() => {
    if (!diffLines2) return;
    const lines = diffLines2
      .map((line) => {
        if (line.type === "add") return `+ ${line.text}`;
        if (line.type === "remove") return `- ${line.text}`;
        return `  ${line.text}`;
      })
      .join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diff.diff";
    a.click();
    URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diffResult]);

  // ─── Copy diff ─────────────────────────────────────────────────────────────

  const handleCopy = useCallback(() => {
    if (!diffLines2) return;
    const text = diffLines2
      .map((line) => {
        if (line.type === "add") return `+ ${line.text}`;
        if (line.type === "remove") return `- ${line.text}`;
        return `  ${line.text}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diffResult]);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-lg bg-[#a78bfa]/10 text-[#a78bfa]">
          <MdCompareArrows size={28} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-white">
            {isEs ? "Comparador de Texto" : "Diff Checker"}
          </h2>
          <p className="text-sm text-zinc-400">
            {isEs
              ? "Compara dos textos y visualiza las diferencias línea a línea"
              : "Compare two texts and visualize line-by-line differences"}
          </p>
        </div>
      </div>

      {/* Textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-300">
              {isEs ? "Original" : "Original"}
            </label>
            {original && (
              <button
                onClick={() => setOriginal("")}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition"
              >
                {isEs ? "Limpiar" : "Clear"}
              </button>
            )}
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder={isEs ? "Pega el texto original aquí…" : "Paste the original text here…"}
            rows={12}
            spellCheck={false}
            className="w-full resize-y p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#a78bfa]/50 focus:ring-1 focus:ring-[#a78bfa]/30 text-sm font-mono leading-relaxed transition"
          />
          <p className="text-xs text-zinc-600 text-right">
            {original.split("\n").length.toLocaleString()} {isEs ? "líneas" : "lines"}
          </p>
        </div>

        {/* Modified */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-300">
              {isEs ? "Modificado" : "Modified"}
            </label>
            {modified && (
              <button
                onClick={() => setModified("")}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition"
              >
                {isEs ? "Limpiar" : "Clear"}
              </button>
            )}
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder={isEs ? "Pega el texto modificado aquí…" : "Paste the modified text here…"}
            rows={12}
            spellCheck={false}
            className="w-full resize-y p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#a78bfa]/50 focus:ring-1 focus:ring-[#a78bfa]/30 text-sm font-mono leading-relaxed transition"
          />
          <p className="text-xs text-zinc-600 text-right">
            {modified.split("\n").length.toLocaleString()} {isEs ? "líneas" : "lines"}
          </p>
        </div>
      </div>

      {/* Controls bar */}
      {hasDiff && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Stats */}
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900/30 border border-emerald-500/20 text-emerald-300 font-medium">
              <span className="text-xs font-bold">+</span>
              {stats.added} {isEs ? "añadidas" : "added"}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-900/30 border border-red-500/20 text-red-300 font-medium">
              <span className="text-xs font-bold">−</span>
              {stats.removed} {isEs ? "eliminadas" : "removed"}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/30 text-zinc-400 font-medium">
              <span className="text-xs font-bold">=</span>
              {stats.unchanged} {isEs ? "sin cambios" : "unchanged"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Line numbers toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-400 hover:text-zinc-200 transition select-none">
              <div
                onClick={() => setShowLineNumbers((v) => !v)}
                className={`relative w-8 h-4 rounded-full transition ${showLineNumbers ? "bg-[#a78bfa]" : "bg-zinc-700"}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${showLineNumbers ? "left-4.5" : "left-0.5"}`} />
              </div>
              {isEs ? "Números de línea" : "Line numbers"}
            </label>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                copied
                  ? "border-emerald-500/40 bg-emerald-900/30 text-emerald-300"
                  : "border-zinc-600/40 bg-zinc-800/60 text-zinc-300 hover:text-white hover:border-zinc-500/50"
              }`}
            >
              {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
              {copied ? (isEs ? "Copiado" : "Copied") : (isEs ? "Copiar diff" : "Copy diff")}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa] hover:bg-[#a78bfa]/20 text-sm font-medium transition"
            >
              <FiDownload size={14} />
              {isEs ? "Descargar .diff" : "Download .diff"}
            </button>
          </div>
        </div>
      )}

      {/* Diff output */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-zinc-700/40 text-zinc-600 gap-3">
          <MdCompareArrows size={40} />
          <p className="text-sm text-center">
            {isEs
              ? "Pega texto en ambos campos para ver las diferencias"
              : "Paste text in both fields to see the differences"}
          </p>
        </div>
      )}

      {diffResult === "too-large" && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-900/20 text-amber-300 text-sm">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>
            {isEs
              ? `El texto supera el límite de ${LINE_LIMIT.toLocaleString()} líneas. Reduce el contenido para comparar.`
              : `The text exceeds the ${LINE_LIMIT.toLocaleString()}-line limit. Reduce the content to compare.`}
          </span>
        </div>
      )}

      {hasDiff && diffLines2 && (
        <div className="rounded-xl border border-zinc-700/40 bg-zinc-900/60 overflow-hidden">
          {/* Output header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-700/40 bg-zinc-800/60">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {isEs ? "Resultado" : "Result"}
            </span>
            <span className="text-xs text-zinc-600">
              {diffLines2.length.toLocaleString()} {isEs ? "líneas totales" : "total lines"}
            </span>
          </div>

          {/* Diff lines */}
          <div className="overflow-auto max-h-[32rem] font-mono text-sm">
            {diffLines2.map((line, idx) => {
              const isAdd = line.type === "add";
              const isRem = line.type === "remove";

              let rowBg = "";
              let prefix = "  ";
              let textColor = "text-zinc-400";

              if (isAdd) {
                rowBg = "bg-emerald-900/25 hover:bg-emerald-900/35";
                prefix = "+ ";
                textColor = "text-emerald-300";
              } else if (isRem) {
                rowBg = "bg-red-900/25 hover:bg-red-900/35";
                prefix = "- ";
                textColor = "text-red-300";
              } else {
                rowBg = "hover:bg-zinc-800/30";
              }

              return (
                <div key={idx} className={`flex items-start group transition ${rowBg}`}>
                  {/* Line numbers */}
                  {showLineNumbers && (
                    <div className="flex shrink-0 select-none border-r border-zinc-700/40">
                      <span className="w-12 text-right px-2 py-0.5 text-[11px] text-zinc-600">
                        {line.origIndex ?? ""}
                      </span>
                      <span className="w-12 text-right px-2 py-0.5 text-[11px] text-zinc-600">
                        {line.modIndex ?? ""}
                      </span>
                    </div>
                  )}

                  {/* Prefix */}
                  <span className={`shrink-0 w-5 text-center py-0.5 text-xs font-bold select-none ${textColor}`}>
                    {prefix.trim() || ""}
                  </span>

                  {/* Content */}
                  <span className={`flex-1 px-2 py-0.5 whitespace-pre-wrap break-all leading-relaxed ${textColor}`}>
                    {line.text || "\u00A0"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

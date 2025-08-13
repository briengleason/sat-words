import React, { useMemo, useRef, useState } from "react";
import WORDS from "./words.json"; // make sure this file is in src/

// Random SAT Word Generator — polished UI (mobile-first)
// - Centered layout
// - Big, thumb-friendly button
// - Clean card with better spacing & typography
// - Keyboard shortcut: N for next, C to copy

function useShuffledQueue(size) {
  const makeOrder = () => shuffle([...Array(size).keys()]);
  const [order, setOrder] = useState(makeOrder);
  const idxRef = useRef(0);

  const next = () => {
    if (idxRef.current >= order.length) {
      const fresh = makeOrder();
      setOrder(fresh);
      idxRef.current = 0;
    }
    const value = order[idxRef.current];
    idxRef.current += 1;
    return value;
  };
  const reset = () => {
    setOrder(makeOrder());
    idxRef.current = 0;
  };
  return { next, reset };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RandomSATWordApp() {
  const queue = useShuffledQueue(WORDS.length);
  const [i, setI] = useState(() => queue.next());
  const [showDef, setShowDef] = useState(true);
  const entry = WORDS[i];

  const nextWord = () => setI(queue.next());
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${entry.w}${entry.pos ? ` (${entry.pos})` : ""} — ${entry.d || ""}`.trim());
      // Optional: add a subtle toast later
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-sky-100 text-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <header className="mb-5 sm:mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Random SAT Word</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">Tap the button or press <kbd className="px-1 py-0.5 border rounded">N</kbd> to get a new word.</p>
        </header>

        <main className="rounded-3xl bg-white shadow-xl ring-1 ring-black/5 p-5 sm:p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-4xl sm:text-5xl font-semibold leading-tight break-words">{entry.w}</div>
                {entry.pos && (
                  <div className="mt-2 inline-flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 border border-slate-200">{entry.pos}</span>
                  </div>
                )}
              </div>
              <button
                onClick={copy}
                className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 active:scale-[.98]"
                title="Copy word & definition"
              >
                Copy
              </button>
            </div>

            {showDef && (entry.d || entry.e) && (
              <div className="mt-1">
                {entry.d && <p className="text-base leading-relaxed text-slate-800">{entry.d}</p>}
                {entry.e && <p className="mt-2 text-sm text-slate-600 italic">e.g., {entry.e}</p>}
              </div>
            )}

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={nextWord}
                className="col-span-1 sm:col-span-2 rounded-2xl px-5 py-4 text-lg font-medium bg-slate-900 text-white hover:opacity-90 active:scale-[.99] shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                aria-label="Get a new word"
              >
                New word
              </button>
              <button
                onClick={() => setShowDef((s) => !s)}
                className="rounded-2xl px-4 py-4 text-sm sm:text-base border border-slate-200 hover:bg-slate-50 active:scale-[.99]"
                aria-pressed={showDef}
              >
                {showDef ? "Hide definition" : "Show definition"}
              </button>
            </div>
          </div>
        </main>

        <footer className="mt-5 text-center text-xs sm:text-sm text-slate-600">
          Mobile tip: the big button is thumb-friendly. Shortcuts: <kbd className="px-1 py-0.5 border rounded">N</kbd> (new), <kbd className="px-1 py-0.5 border rounded">C</kbd> (copy).
        </footer>
      </div>

      <KeyHandler onN={nextWord} onC={copy} />
    </div>
  );
}

function KeyHandler({ onN, onC }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "n" || e.key === "N") onN();
      if (e.key === "c" || e.key === "C") onC();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onN, onC]);
  return null;
}


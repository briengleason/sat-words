import React, { useRef, useState } from "react";
import WORDS from "./words.json"; // ensure this file is in src/

// Random SAT Word Generator — super simple, mobile-first
// - Big type for the word
// - One large centered "New word" button
// - Minimal chrome so it looks great on iPhone

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
  return { next };
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
      await navigator.clipboard.writeText(`${entry.w}${entry.pos ? ` (${entry.pos})` : ""}${entry.d ? ` — ${entry.d}` : ""}`.trim());
    } catch {}
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-5">
      <div className="w-full max-w-md text-center">
        <h1 className="sr-only">Random SAT Word</h1>

        <div className="select-none">
          <div className="text-[clamp(2.25rem,9vw,3.75rem)] font-extrabold leading-[1.05] break-words">{entry.w}</div>
          {entry.pos && (
            <div className="mt-2 inline-block text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              {entry.pos}
            </div>
          )}
          {showDef && entry.d && (
            <p className="mt-3 text-[1.05rem] leading-relaxed text-slate-700">{entry.d}</p>
          )}
          {showDef && entry.e && (
            <p className="mt-2 text-sm text-slate-500 italic">e.g., {entry.e}</p>
          )}
        </div>

        <button
          onClick={nextWord}
          className="mt-8 w-full rounded-3xl py-5 text-xl font-semibold bg-slate-900 text-white shadow-lg active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          aria-label="Get a new player"
        >
          New Player
        </button>

        <div className="mt-3 flex items-center justify-center gap-4 text-sm text-slate-500">
          <button onClick={copy} className="underline underline-offset-2 hover:text-slate-700">Copy</button>
          <span>•</span>
          <button onClick={() => setShowDef((s) => !s)} className="underline underline-offset-2 hover:text-slate-700">
            {showDef ? "Hide details" : "Show details"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Keyboard shortcuts (optional): N for new, C for copy
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


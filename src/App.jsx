import React, { useMemo, useRef, useState } from "react";
import WORDS from "./words.json"; // Large SAT word list

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
      await navigator.clipboard.writeText(`${entry.w} (${entry.pos}) — ${entry.d}`);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <header className="mb-6 flex justify-between">
          <h1 className="text-3xl font-bold">Random SAT Word</h1>
        </header>

        <div className="rounded-2xl bg-white shadow-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-4xl font-semibold">{entry.w}</div>
              <span className="px-2 py-0.5 text-xs bg-slate-100 border border-slate-200 rounded-full">{entry.pos}</span>
            </div>
            <button onClick={copy} className="border px-3 py-2 rounded-lg text-sm hover:bg-slate-50">Copy</button>
          </div>

          {showDef && (
            <div className="mt-4">
              <p>{entry.d}</p>
              {entry.e && <p className="mt-2 text-sm italic text-slate-600">e.g., {entry.e}</p>}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={nextWord} className="bg-slate-900 text-white px-4 py-2 rounded-lg">New word</button>
            <button onClick={() => setShowDef((s) => !s)} className="border px-3 py-2 rounded-lg">
              {showDef ? "Hide definition" : "Show definition"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

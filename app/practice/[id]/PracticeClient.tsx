"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type Verse = {
  id: string;
  reference: string;
  translation: string;
  text: string;
};

type WordState = {
  word: string;
  revealed: boolean;
  correct: boolean | null;
};

function scoreSubmission(expected: string, typed: string) {
  const expectedWords = expected.trim().split(/\s+/);
  const typedWords = typed.trim().split(/\s+/);
  const clean = (w: string) => w.replace(/[.,;:!?'"]/g, "").toLowerCase();

  return expectedWords.map((word, i) => ({
    expected: word,
    typed: typedWords[i] ?? "",
    correct: clean(word) === clean(typedWords[i] ?? ""),
  }));
}

export default function PracticeClient({
  verse,
  mode,
}: {
  verse: Verse;
  mode: "firstletter" | "full";
}) {
  const words = verse.text.trim().split(/\s+/);

  const [wordStates, setWordStates] = useState<WordState[]>(
    words.map((w) => ({ word: w, revealed: false, correct: null })),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [finished, setFinished] = useState(false);

  // full mode state
  const [fullInput, setFullInput] = useState("");
  const [fullResults, setFullResults] = useState<
    { expected: string; typed: string; correct: boolean }[] | null
  >(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const clean = (w: string) => w.replace(/[.,;:!?'"]/g, "").toLowerCase();

  const handleFirstLetterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return;
    const key = e.key.toLowerCase();

    // ignore non-letter keys except space
    if (key.length !== 1) return;

    const currentWord = words[currentIndex];
    const firstLetter = currentWord[0].toLowerCase();

    if (key === firstLetter) {
      // correct first letter — reveal the word
      const updated = [...wordStates];
      updated[currentIndex] = {
        word: currentWord,
        revealed: true,
        correct: true,
      };
      setWordStates(updated);
      setCurrentInput("");

      if (currentIndex + 1 >= words.length) {
        setFinished(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      // wrong letter — mark incorrect and still advance
      const updated = [...wordStates];
      updated[currentIndex] = {
        word: currentWord,
        revealed: true,
        correct: false,
      };
      setWordStates(updated);
      setCurrentInput("");

      if (currentIndex + 1 >= words.length) {
        setFinished(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }

    e.preventDefault();
  };

  const correctCount = wordStates.filter((w) => w.correct === true).length;
  const accuracy = finished
    ? Math.round((correctCount / words.length) * 100)
    : null;

  const fullAccuracy = fullResults
    ? Math.round(
        (fullResults.filter((r) => r.correct).length / fullResults.length) *
          100,
      )
    : null;

  const handleReset = () => {
    setWordStates(
      words.map((w) => ({ word: w, revealed: false, correct: null })),
    );
    setCurrentIndex(0);
    setCurrentInput("");
    setFinished(false);
    setFullInput("");
    setFullResults(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            ← Back to verses
          </Link>
          <h1 className="text-3xl font-serif font-bold text-stone-800 mt-4 mb-1">
            {mode === "firstletter" ? "First Letter Mode" : "Full Memory Mode"}
          </h1>
          <p className="text-xs text-stone-400 uppercase tracking-widest">
            {verse.reference} · {verse.translation}
          </p>
        </div>

        {/* FIRST LETTER MODE */}
        {mode === "firstletter" && (
          <div className="space-y-6">
            <p className="text-xs text-stone-400">
              Type the first letter of each word — the rest will fill in
              automatically.
            </p>

            {/* Word display */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 flex flex-wrap gap-2 min-h-24">
              {wordStates.map((ws, i) => (
                <span
                  key={i}
                  className={`text-sm font-medium px-1 rounded transition-all ${
                    ws.revealed
                      ? ws.correct
                        ? "text-green-700 bg-green-50"
                        : "text-red-600 bg-red-50"
                      : i === currentIndex
                        ? "text-stone-400 bg-stone-100 animate-pulse"
                        : "text-stone-200"
                  }`}
                >
                  {ws.revealed ? ws.word : "___"}
                </span>
              ))}
            </div>

            {/* Hidden input to capture keystrokes */}
            {!finished && (
              <div className="space-y-2">
                <input
                  ref={inputRef}
                  autoFocus
                  value={currentInput}
                  onChange={() => {}}
                  onKeyDown={handleFirstLetterKey}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="Type the first letter of each word..."
                />
              </div>
            )}

            {/* Results */}
            {finished && (
              <div className="space-y-4">
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
                    Accuracy
                  </p>
                  <p
                    className={`text-4xl font-serif font-bold ${accuracy === 100 ? "text-green-600" : accuracy! >= 80 ? "text-yellow-600" : "text-red-500"}`}
                  >
                    {accuracy}%
                  </p>
                  {accuracy === 100 && (
                    <p className="text-sm text-green-600 mt-1">Perfect! 🎉</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/"
                    className="text-sm px-5 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    Back to Verses
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FULL MEMORY MODE */}
        {mode === "full" && (
          <div className="space-y-4">
            {!fullResults ? (
              <>
                <textarea
                  value={fullInput}
                  onChange={(e) => setFullInput(e.target.value)}
                  rows={5}
                  placeholder="Type the verse from memory..."
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
                />
                <button
                  onClick={() =>
                    setFullResults(scoreSubmission(verse.text, fullInput))
                  }
                  disabled={!fullInput.trim()}
                  className="text-sm px-6 py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors"
                >
                  Check My Answer
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
                    Accuracy
                  </p>
                  <p
                    className={`text-4xl font-serif font-bold ${fullAccuracy === 100 ? "text-green-600" : fullAccuracy! >= 80 ? "text-yellow-600" : "text-red-500"}`}
                  >
                    {fullAccuracy}%
                  </p>
                  {fullAccuracy === 100 && (
                    <p className="text-sm text-green-600 mt-1">Perfect! 🎉</p>
                  )}
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <p className="text-xs text-stone-400 uppercase tracking-widest mb-3">
                    Word Breakdown
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {fullResults.map((r, i) => (
                      <div key={i} className="text-center">
                        <div
                          className={`px-2 py-1 rounded text-sm font-medium ${r.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                        >
                          {r.typed || "—"}
                        </div>
                        {!r.correct && (
                          <div className="text-xs text-stone-400 mt-1">
                            {r.expected}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5">
                  <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">
                    Correct Verse
                  </p>
                  <p className="text-stone-700 text-sm leading-relaxed">
                    {verse.text}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="text-sm px-5 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/"
                    className="text-sm px-5 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    Back to Verses
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

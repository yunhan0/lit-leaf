import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateGame } from "./data";
import type { Round } from "./data";
import { useProfileStore } from "../../context/profiles";

type Feedback = "correct" | "wrong" | null;

export function MatchGame() {
  const navigate = useNavigate();
  const { activeProfile, addStars } = useProfileStore();
  const [rounds] = useState<Round[]>(() => generateGame(5));
  const [currentRound, setCurrentRound] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  const round = rounds[currentRound];
  const isLastRound = currentRound === rounds.length - 1;

  const saveProgress = useCallback(
    async (earnedStars: number) => {
      if (!activeProfile || saved) return;
      try {
        const res = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            profileId: activeProfile.id,
            gameCategory: "match",
            gameId: "find-different",
            score: earnedStars,
            stars: earnedStars,
          }),
        });
        if (res.ok) {
          addStars(activeProfile.id, earnedStars);
          setSaved(true);
        }
      } catch {}
    },
    [activeProfile, saved, addStars]
  );

  const handleTap = useCallback(
    (index: number) => {
      if (feedback) return;

      setSelectedIndex(index);

      if (index === round.differentIndex) {
        setFeedback("correct");
        const earnedStars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
        const newTotal = stars + earnedStars;
        setStars(newTotal);
        setTimeout(() => {
          if (isLastRound) {
            setGameComplete(true);
            saveProgress(newTotal);
          } else {
            setCurrentRound((r) => r + 1);
            setFeedback(null);
            setSelectedIndex(null);
            setAttempts(0);
          }
        }, 1500);
      } else {
        setFeedback("wrong");
        setAttempts((a) => a + 1);
        setTimeout(() => {
          setFeedback(null);
          setSelectedIndex(null);
        }, 800);
      }
    },
    [feedback, round, isLastRound, attempts, stars, saveProgress]
  );

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-3xl font-bold text-amber-600 mb-2">
            Great job!
          </h1>
          <div className="text-4xl my-4">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < Math.ceil(stars / 3) ? "" : "opacity-20"}>
                ⭐
              </span>
            ))}
          </div>
          <p className="text-gray-500 mb-6">
            You earned {stars} stars!
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/games/match")}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      <header className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          ✕ Quit
        </button>
        <div className="flex items-center gap-1">
          {rounds.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < currentRound
                  ? "bg-emerald-500"
                  : i === currentRound
                  ? "bg-emerald-400 ring-2 ring-emerald-300"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          ⭐ {stars}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <p className="text-xl font-semibold text-emerald-700 mb-2">
          Round {currentRound + 1}
        </p>
        <p className="text-gray-500 mb-8 text-sm">{round.prompt}</p>

        <div className="flex gap-5 items-center">
          {round.items.map((item, i) => {
            let ringClass = "ring-gray-200";
            if (feedback === "correct" && i === round.differentIndex) {
              ringClass = "ring-emerald-400";
            }
            if (feedback === "wrong" && i === selectedIndex) {
              ringClass = "ring-red-300";
            }

            return (
              <button
                key={i}
                onClick={() => handleTap(i)}
                disabled={feedback !== null}
                className={`
                  text-7xl w-28 h-28 rounded-2xl bg-white shadow-md flex items-center justify-center
                  transition-all duration-300 ring-4 ${ringClass}
                  active:scale-95
                  ${feedback === "correct" && i === round.differentIndex ? "animate-bounce scale-110" : ""}
                  ${feedback === "wrong" && i === selectedIndex ? "animate-[shake_0.4s_ease-in-out]" : ""}
                  hover:shadow-lg hover:scale-105
                `}
              >
                {item.emoji}
              </button>
            );
          })}
        </div>

        {feedback === "correct" && (
          <div className="mt-8 text-3xl animate-bounce">✨ Yay! ✨</div>
        )}
        {feedback === "wrong" && (
          <div className="mt-8 text-xl text-gray-400">Try again!</div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
}

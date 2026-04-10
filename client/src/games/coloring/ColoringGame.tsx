import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PAGES, COLORS, type ColoringPage } from "./data";
import { useProfileStore } from "../../context/profiles";

type Phase = "select" | "coloring" | "complete";

export function ColoringGame() {
  const navigate = useNavigate();
  const { activeProfile, addStars } = useProfileStore();
  const [phase, setPhase] = useState<Phase>("select");
  const [page, setPage] = useState<ColoringPage | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [fills, setFills] = useState<Record<string, string>>({});
  const [fillHistory, setFillHistory] = useState<{ regionId: string; prevColor: string }[]>([]);
  const [saved, setSaved] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const allFilled = page
    ? page.regions.every((r) => fills[r.id] !== undefined)
    : false;

  const handlePageSelect = useCallback((p: ColoringPage) => {
    setPage(p);
    setFills({});
    setFillHistory([]);
    setPhase("coloring");
  }, []);

  const handleRegionTap = useCallback(
    (regionId: string) => {
      setFillHistory((h) => [...h, { regionId, prevColor: fills[regionId] ?? "" }]);
      setFills((prev) => ({ ...prev, [regionId]: selectedColor }));
    },
    [selectedColor, fills]
  );

  const handleUndo = useCallback(() => {
    if (fillHistory.length === 0) return;
    const last = fillHistory[fillHistory.length - 1];
    setFillHistory((h) => h.slice(0, -1));
    setFills((prev) => {
      const next = { ...prev };
      if (last.prevColor) {
        next[last.regionId] = last.prevColor;
      } else {
        delete next[last.regionId];
      }
      return next;
    });
  }, [fillHistory]);

  const handleReset = useCallback(() => {
    setFills({});
    setFillHistory([]);
  }, []);

  const handleComplete = useCallback(async () => {
    if (!activeProfile || !page || saved) return;
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          profileId: activeProfile.id,
          gameCategory: "coloring",
          gameId: `coloring-${page.id}`,
          score: 1,
          stars: 1,
        }),
      });
      if (res.ok) {
        addStars(activeProfile.id, 1);
        setSaved(true);
      }
    } catch {}
  }, [activeProfile, page, saved, addStars]);

  const handleDone = useCallback(() => {
    if (allFilled && !saved) {
      handleComplete();
    }
    setPhase("complete");
  }, [allFilled, saved, handleComplete]);

  if (phase === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-fuchsia-100 flex flex-col">
        <header className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            ✕ Quit
          </button>
          <span className="text-lg font-bold text-purple-600">Pick a picture!</span>
          <div className="w-12" />
        </header>

        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
            {PAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePageSelect(p)}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95"
              >
                <div className="text-5xl">{p.emoji}</div>
                <span className="font-semibold text-purple-700">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-fuchsia-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4 animate-bounce">🎨</div>
          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            Beautiful!
          </h1>
          <div className="text-4xl my-4">⭐</div>
          <p className="text-gray-500 mb-6">
            You earned 1 star for coloring!
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                setPhase("select");
                setPage(null);
                setSaved(false);
              }}
              className="flex-1 py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors"
            >
              Color More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-fuchsia-100 flex flex-col">
      <header className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          ✕ Quit
        </button>
        <span className="text-lg font-bold text-purple-600">
          Color the {page?.name}!
        </span>
        <button
          onClick={() => {
            setPhase("select");
            setPage(null);
            setFills({});
            setFillHistory([]);
          }}
          className="text-sm text-purple-400 hover:text-purple-600"
        >
          ← Back
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
        {page && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-4">
            {renderSVG(page.id, fills, selectedColor, hoveredRegion, handleRegionTap, setHoveredRegion)}
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <button
            onClick={handleUndo}
            disabled={fillHistory.length === 0}
            className="px-4 py-2 rounded-xl bg-white shadow-sm text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-default"
          >
            ↩ Undo
          </button>
          <button
            onClick={handleReset}
            disabled={Object.keys(fills).length === 0}
            className="px-4 py-2 rounded-xl bg-white shadow-sm text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-default"
          >
            🗑 Reset
          </button>
        </div>

        <div className="flex gap-3 items-center justify-center flex-wrap max-w-xs">
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedColor(c.hex)}
              className={`
                w-12 h-12 rounded-full transition-all
                ${selectedColor === c.hex ? "ring-4 ring-purple-400 scale-110" : "ring-2 ring-gray-200 hover:scale-105"}
              `}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        {allFilled && (
          <button
            onClick={handleDone}
            className="mt-4 px-8 py-3 rounded-xl bg-purple-500 text-white font-bold text-lg hover:bg-purple-600 transition-colors animate-bounce"
          >
            ✨ Done! ✨
          </button>
        )}
      </div>
    </div>
  );
}

function renderSVG(
  pageId: string,
  fills: Record<string, string>,
  _selectedColor: string,
  hoveredRegion: string | null,
  onRegionTap: (id: string) => void,
  onHover: (id: string | null) => void,
) {
  const getFill = (id: string) => fills[id] || "white";
  const isHovered = (id: string) => hoveredRegion === id;
  const commonProps = (id: string) => ({
    onClick: () => onRegionTap(id),
    onMouseEnter: () => onHover(id),
    onMouseLeave: () => onHover(null),
    style: {
      cursor: "pointer",
      transition: "fill 0.2s, opacity 0.2s",
      opacity: isHovered(id) && !fills[id] ? 0.7 : 1,
    } as React.CSSProperties,
  });

  const strokeWidth = 3;
  const regionStroke = "#333";

  if (pageId === "bear") {
    return (
      <svg width="260" height="260" viewBox="0 0 260 260">
        <circle cx="70" cy="55" r="40" fill={getFill("left-ear")} stroke={regionStroke} strokeWidth={strokeWidth} {...commonProps("left-ear")} />
        <circle cx="190" cy="55" r="40" fill={getFill("right-ear")} stroke={regionStroke} strokeWidth={strokeWidth} {...commonProps("right-ear")} />
        <circle cx="130" cy="145" r="85" fill={getFill("face")} stroke={regionStroke} strokeWidth={strokeWidth} {...commonProps("face")} />
        <ellipse cx="100" cy="125" rx="14" ry="16" fill={getFill("left-eye")} stroke={regionStroke} strokeWidth={2} {...commonProps("left-eye")} />
        <ellipse cx="160" cy="125" rx="14" ry="16" fill={getFill("right-eye")} stroke={regionStroke} strokeWidth={2} {...commonProps("right-eye")} />
        <ellipse cx="130" cy="160" rx="16" ry="12" fill={getFill("nose")} stroke={regionStroke} strokeWidth={2} {...commonProps("nose")} />
        <path d="M95 185 Q130 210 165 185" fill={getFill("mouth")} stroke={regionStroke} strokeWidth={2.5} strokeLinecap="round" {...commonProps("mouth")} />
      </svg>
    );
  }

  if (pageId === "bunny") {
    return (
      <svg width="260" height="280" viewBox="0 0 260 280">
        <ellipse cx="85" cy="65" rx="28" ry="60" fill={getFill("left-ear")} stroke={regionStroke} strokeWidth={strokeWidth} {...commonProps("left-ear")} />
        <ellipse cx="175" cy="65" rx="28" ry="60" fill={getFill("right-ear")} stroke={regionStroke} strokeWidth={strokeWidth} {...commonProps("right-ear")} />
        <ellipse cx="130" cy="185" rx="90" ry="80" fill={getFill("face")} stroke={regionStroke} strokeWidth={strokeWidth} {...commonProps("face")} />
        <circle cx="100" cy="170" r="10" fill={getFill("left-eye")} stroke={regionStroke} strokeWidth={2} {...commonProps("left-eye")} />
        <circle cx="160" cy="170" r="10" fill={getFill("right-eye")} stroke={regionStroke} strokeWidth={2} {...commonProps("right-eye")} />
        <ellipse cx="130" cy="198" rx="8" ry="6" fill={getFill("nose")} stroke={regionStroke} strokeWidth={2} {...commonProps("nose")} />
        <path d="M110 215 Q130 230 150 215" fill={getFill("mouth")} stroke={regionStroke} strokeWidth={2.5} strokeLinecap="round" {...commonProps("mouth")} />
      </svg>
    );
  }

  if (pageId === "cat") {
    return (
      <svg width="260" height="260" viewBox="0 0 260 260">
        <polygon points="55,100 80,30 110,100" fill={getFill("left-ear")} stroke={regionStroke} strokeWidth={strokeWidth} strokeLinejoin="round" {...commonProps("left-ear")} />
        <polygon points="150,100 180,30 205,100" fill={getFill("right-ear")} stroke={regionStroke} strokeWidth={strokeWidth} strokeLinejoin="round" {...commonProps("right-ear")} />
        <circle cx="130" cy="150" r="85" fill={getFill("face")} stroke={regionStroke} strokeWidth={strokeWidth} {...commonProps("face")} />
        <ellipse cx="100" cy="135" rx="12" ry="16" fill={getFill("left-eye")} stroke={regionStroke} strokeWidth={2} {...commonProps("left-eye")} />
        <ellipse cx="160" cy="135" rx="12" ry="16" fill={getFill("right-eye")} stroke={regionStroke} strokeWidth={2} {...commonProps("right-eye")} />
        <ellipse cx="130" cy="165" rx="10" ry="7" fill={getFill("nose")} stroke={regionStroke} strokeWidth={2} {...commonProps("nose")} />
        <path d="M105 185 Q130 200 155 185" fill={getFill("mouth")} stroke={regionStroke} strokeWidth={2.5} strokeLinecap="round" {...commonProps("mouth")} />
      </svg>
    );
  }

  return null;
}

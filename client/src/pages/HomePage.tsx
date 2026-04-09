import { useAuth } from "../hooks/useAuth";
import { useProfileStore } from "../context/profiles";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const { user, logout } = useAuth();
  const { activeProfile } = useProfileStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold text-emerald-700">Lit Leaf</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profiles")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            {activeProfile ? (
              <>
                <span className="text-xl">{activeProfile.avatar || "🦁"}</span>
                <span className="text-sm text-gray-600">
                  {activeProfile.name}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-400">Select profile</span>
            )}
          </button>
          {user?.avatar && (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          )}
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-8 text-center">
        {activeProfile ? (
          <>
            <div className="text-6xl mb-4">{activeProfile.avatar || "🦁"}</div>
            <h1 className="text-3xl font-bold text-emerald-700 mb-2">
              Hi, {activeProfile.name}!
            </h1>
            <p className="text-gray-500 mb-8">
              Ready to play and learn?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-3">
                <span className="text-4xl">🔍</span>
                <span className="font-semibold text-emerald-700">
                  Find & Match
                </span>
                <span className="text-xs text-gray-400">Coming soon</span>
              </button>
              <button className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-3">
                <span className="text-4xl">🔤</span>
                <span className="font-semibold text-emerald-700">Letters</span>
                <span className="text-xs text-gray-400">Coming soon</span>
              </button>
              <button className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col items-center gap-3">
                <span className="text-4xl">🎨</span>
                <span className="font-semibold text-emerald-700">Coloring</span>
                <span className="text-xs text-gray-400">Coming soon</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-emerald-700 mb-4">
              Welcome, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-gray-500 mb-6">
              Select a profile to get started.
            </p>
            <button
              onClick={() => navigate("/profiles")}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors"
            >
              Choose a profile
            </button>
          </>
        )}
      </main>
    </div>
  );
}

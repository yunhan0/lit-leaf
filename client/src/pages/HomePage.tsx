import { useAuth } from "../hooks/useAuth";

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold text-emerald-700">Lit Leaf</span>
        </div>
        <div className="flex items-center gap-4">
          {user?.avatar && (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          )}
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-4">
          Welcome, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-500 mb-8">
          Select a profile to get started, or create one below.
        </p>
        <p className="text-gray-400">Child profiles coming in Phase 2...</p>
      </main>
    </div>
  );
}

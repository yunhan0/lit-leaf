import { useState } from "react";
import { useProfileStore } from "../context/profiles";

const AVATARS = ["🦁", "🐱", "🐰", "🐻", "🦊", "🐸", "🐼", "🦋", "🌸", "⭐"];

interface ProfileFormProps {
  onSubmit: (data: {
    name: string;
    avatar: string;
    ageGroup: string;
  }) => void;
  initial?: {
    name: string;
    avatar: string;
    ageGroup: string;
  };
  submitLabel: string;
}

function ProfileForm({ onSubmit, initial, submitLabel }: ProfileFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [avatar, setAvatar] = useState(initial?.avatar ?? "🦁");
  const [ageGroup, setAgeGroup] = useState(initial?.ageGroup ?? "2-3");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, avatar, ageGroup });
      }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose an avatar
        </label>
        <div className="flex flex-wrap gap-3 justify-center">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`text-4xl w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                avatar === a
                  ? "bg-emerald-100 ring-2 ring-emerald-500 scale-110"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Child's name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
          maxLength={30}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-lg text-center"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age group
        </label>
        <div className="flex gap-3 justify-center">
          {(["2-3", "4-5", "5-8"] as const).map((ag) => (
            <button
              key={ag}
              type="button"
              onClick={() => setAgeGroup(ag)}
              className={`px-5 py-2 rounded-xl text-lg font-medium transition-all ${
                ageGroup === ag
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {ag}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full py-3 rounded-xl bg-emerald-500 text-white text-lg font-bold hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export function ProfileSelectPage() {
  const { profiles, addProfile, removeProfile, setActiveProfile } =
    useProfileStore();
  const [showCreate, setShowCreate] = useState(profiles.length === 0);

  const handleCreate = async (data: {
    name: string;
    avatar: string;
    ageGroup: string;
  }) => {
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { profile } = await res.json();
      addProfile(profile);
      setActiveProfile(profile);
    }
  };

  if (showCreate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-emerald-700 text-center mb-6">
            Create a profile
          </h2>
          <ProfileForm
            onSubmit={handleCreate}
            submitLabel="Create & Start"
          />
          {profiles.length > 0 && (
            <button
              onClick={() => setShowCreate(false)}
              className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Back to profiles
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
        <div className="text-4xl mb-2">🌿</div>
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">
          Who's playing?
        </h2>
        <p className="text-gray-400 mb-6 text-sm">Pick a profile to start</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {profiles.map((p) => (
            <div key={p.id} className="relative group">
              <button
                onClick={() => setActiveProfile(p)}
                className="w-full p-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-5xl">{p.avatar || "🦁"}</span>
                <span className="text-lg font-semibold text-emerald-700">
                  {p.name}
                </span>
                <span className="text-xs text-emerald-500">Age {p.ageGroup}</span>
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Remove ${p.name}'s profile?`)) {
                    await fetch(`/api/profiles/${p.id}`, {
                      method: "DELETE",
                      credentials: "include",
                    });
                    removeProfile(p.id);
                  }
                }}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-100 text-red-500 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={() => setShowCreate(true)}
            className="p-6 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-colors flex flex-col items-center gap-2 text-emerald-400 hover:text-emerald-600"
          >
            <span className="text-4xl">+</span>
            <span className="text-sm font-medium">Add profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

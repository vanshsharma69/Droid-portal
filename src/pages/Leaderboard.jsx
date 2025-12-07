import { Crown } from "lucide-react";
import { useMembers } from "../context/MembersContext";

export default function Leaderboard() {
  const { members, loading, error } = useMembers();

  const sorted = [...members].sort((a, b) => (b.points || 0) - (a.points || 0));

  // Rank colors
  const rankStyles = {
    1: "bg-yellow-400 text-black",
    2: "bg-gray-300 text-black",
    3: "bg-amber-700 text-white",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      {loading && <p className="text-gray-600">Loading members...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {sorted.map((m, index) => {
          const rank = index + 1;

          return (
            <div
              key={m.id}
              className={`relative p-6 bg-white rounded-xl shadow hover:shadow-lg transition 
              ${rank <= 3 ? "border-2 border-black" : "border border-gray-200"}
            `}
            >

              {/* Rank Badge */}
              <div
                className={`absolute -top-4 -right-4 px-4 py-2 rounded-full font-bold shadow 
                ${rankStyles[rank] || "bg-black text-white"}`}
              >
                #{rank}
              </div>

              {/* Trophy for TOP 3 */}
              {rank <= 3 && (
                <div className="absolute -top-5 left-4 text-yellow-500">
                  <Crown size={32} />
                </div>
              )}

              {/* IMAGE */}
              <div className="flex justify-center">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-28 h-28 rounded-full object-cover shadow-md"
                />
              </div>

              {/* INFO */}
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold">{m.name}</h2>
                <p className="text-gray-600 text-sm">{m.role}</p>
              </div>

              {/* POINTS */}
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">
                  Points: <span className="text-black">{m.points}</span>
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

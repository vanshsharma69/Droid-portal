import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { members as memberData } from "../Data/members";

export default function Members() {
  const { user } = useAuth();
  const [members, setMembers] = useState(memberData);

  // Add Member
  const addMember = () => {
    const name = prompt("Enter member name:");
    if (!name) return;

    const role = prompt("Enter role:");
    if (!role) return;

    const newMember = {
      id: Date.now(),
      name,
      role,
      img: "https://i.pravatar.cc/400?u=" + Date.now(),
      points: 0,
      birthday: "Not set",
      year: "Not set",
      course: "Not set",
      branch: "Not set",
      roll: "Not set",
      attendance: { daily: [], events: [] },
      events: [],
      projects: [],
      performance: { rating: 0, badges: [], history: [] },
      announcementsRead: [],
      leaderboardRank: "-",
    };

    setMembers([...members, newMember]);
  };

  // Delete Member
  const deleteMember = (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members</h1>

        {user?.role === "superadmin" && (
          <button
            onClick={addMember}
            className="px-4 py-2 bg-black text-white rounded-lg shadow hover:opacity-80 transition"
          >
            + Add Member
          </button>
        )}
      </div>

      {/* MEMBERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white shadow-sm hover:shadow-lg p-4 rounded-xl transition relative"
          >
            {/* Link to Details */}
            <Link to={`/members/${m.id}`} state={{ m }}>
              <img
                src={m.img}
                alt={m.name}
                className="w-full h-80 object-cover rounded-xl"
              />

              <h2 className="text-xl font-bold mt-3">{m.name}</h2>
              <p className="text-gray-600">{m.role}</p>
            </Link>

            {/* SUPERADMIN CRUD BUTTONS */}
            {user?.role === "superadmin" && (
              <div className="flex gap-3 mt-4">
                
                {/* EDIT redirects to MemberDetails with edit enabled */}
                <Link
                  to={`/members/${m.id}`}
                  state={{ m, editMode: true }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
                >
                  Edit
                </Link>

                {/* DELETE */}
                <button
                  onClick={() => deleteMember(m.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

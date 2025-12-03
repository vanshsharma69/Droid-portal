import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function MemberDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const m = state?.m;

  if (!m) return <h1 className="text-xl font-bold">Member not found</h1>;

  // Local editable state
  const [member, setMember] = useState({ ...m });
  const [editMode, setEditMode] = useState(false);

  // Handle change
  const updateField = (field, value) => {
    setMember({ ...member, [field]: value });
  };

  // Delete member
  const deleteMember = () => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    alert("Member deleted (local only, backend not connected)");
    navigate("/members");
  };

  return (
    <div className="max-w-7xl mx-auto py-6">

      {/* Title */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Member Details</h1>

        {/* SuperAdmin Controls */}
        {user?.role === "superadmin" && (
          <div className="flex gap-3">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Edit Member
              </button>
            ) : (
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            )}

            <button
              onClick={deleteMember}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-12 bg-white p-8 rounded-xl shadow-md">

        {/* LEFT — Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={member.img}
            alt={member.name}
            className="w-100 h-[420px] object-cover rounded-xl shadow-md"
          />
        </div>

        {/* RIGHT — Info */}
        <div className="w-full md:w-1/2 text-gray-800 space-y-4">

          {/* Name */}
          {!editMode ? (
            <h2 className="text-3xl font-bold">Name: {member.name}</h2>
          ) : (
            <input
              type="text"
              className="text-3xl font-bold border p-2 rounded w-full"
              value={member.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          )}

          {/* Role */}
          {!editMode ? (
            <p className="text-xl text-gray-600">Role: {member.role}</p>
          ) : (
            <input
              type="text"
              className="text-xl border p-2 rounded w-full"
              value={member.role}
              onChange={(e) => updateField("role", e.target.value)}
            />
          )}

          <p className="text-md text-gray-500">
            Below are the personal and academic details of this member.
          </p>

          {/* All Details */}
          <div className="space-y-2 text-lg mt-6">

            {/* Points */}
            <div>
              <span className="font-semibold">Achievement Points:</span>{" "}
              {!editMode ? (
                member.points
              ) : (
                <input
                  type="number"
                  className="border p-1 rounded ml-2"
                  value={member.points}
                  onChange={(e) => updateField("points", e.target.value)}
                />
              )}
            </div>

            {/* Birthday */}
            <div>
              <span className="font-semibold">Birthday:</span>{" "}
              {!editMode ? (
                member.birthday
              ) : (
                <input
                  type="text"
                  className="border p-1 rounded ml-2"
                  value={member.birthday}
                  onChange={(e) => updateField("birthday", e.target.value)}
                />
              )}
            </div>

            {/* Year */}
            <div>
              <span className="font-semibold">College Year:</span>{" "}
              {!editMode ? (
                member.year
              ) : (
                <input
                  type="text"
                  className="border p-1 rounded ml-2"
                  value={member.year}
                  onChange={(e) => updateField("year", e.target.value)}
                />
              )}
            </div>

            {/* Course */}
            <div>
              <span className="font-semibold">Course:</span>{" "}
              {!editMode ? (
                member.course
              ) : (
                <input
                  type="text"
                  className="border p-1 rounded ml-2"
                  value={member.course}
                  onChange={(e) => updateField("course", e.target.value)}
                />
              )}
            </div>

            {/* Branch */}
            <div>
              <span className="font-semibold">Branch:</span>{" "}
              {!editMode ? (
                member.branch
              ) : (
                <input
                  type="text"
                  className="border p-1 rounded ml-2"
                  value={member.branch}
                  onChange={(e) => updateField("branch", e.target.value)}
                />
              )}
            </div>

            {/* Roll */}
            <div>
              <span className="font-semibold">University Roll No:</span>{" "}
              {!editMode ? (
                member.roll
              ) : (
                <input
                  type="text"
                  className="border p-1 rounded ml-2"
                  value={member.roll}
                  onChange={(e) => updateField("roll", e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

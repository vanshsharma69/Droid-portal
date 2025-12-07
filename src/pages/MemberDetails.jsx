import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMembers } from "../context/MembersContext";

const normalizeMember = (m) => {
  if (!m) return m;
  const id = m.id || m._id;
  return { ...m, id };
};

export default function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { members, getMemberById, updateMember, deleteMember, refresh } = useMembers();

  const [member, setMember] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const isAdmin = user && (user.role === "superadmin" || user.role === "admin");
  const canEdit = Boolean(isAdmin);
  const canDelete = Boolean(isAdmin);

  const memberKey = (m) => m?.id ?? m?._id ?? m?.memberId;
  const targetId = id;

  useEffect(() => {
    const current = getMemberById(targetId);
    if (current) {
      setMember(normalizeMember(current));
    } else {
      refresh();
    }
  }, [getMemberById, targetId, refresh]);

  useEffect(() => {
    const current = getMemberById(targetId);
    if (current) setMember(normalizeMember(current));
  }, [members, getMemberById, targetId]);

  if (!member) return <h1 className="text-xl font-bold">Member not found</h1>;

  const memberObj = normalizeMember(member);
  if (!memberObj || memberKey(memberObj) === undefined) return <h1 className="text-xl font-bold">Member not found</h1>;

  const updateField = (field, value) => {
    setMember({ ...member, [field]: value });
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      if (newImage) {
        const fd = new FormData();
        Object.entries(memberObj || {}).forEach(([key, value]) => {
          if (key === "id" || key === "_id" || key === "img") return;
          if (value !== undefined && value !== null) {
            if (key === "memberId") {
              const num = Number(value);
              fd.append(key, Number.isNaN(num) ? value : num);
            } else {
              fd.append(key, String(value));
            }
          }
        });
        fd.append("img", newImage);
        await updateMember(memberKey(memberObj), fd);
      } else {
        const payload = { ...memberObj };
        delete payload._id;
        delete payload.id;
        delete payload.img;
        if (payload.memberId !== undefined && payload.memberId !== null) {
          const num = Number(payload.memberId);
          payload.memberId = Number.isNaN(num) ? payload.memberId : num;
        }
        await updateMember(memberKey(memberObj), payload);
      }
      setNewImage(null);
      setEditMode(false);
    } catch (err) {
      alert(err?.message || "Failed to update member");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this member?")) return;
    setBusy(true);
    try {
      await deleteMember(memberKey(memberObj));
      navigate("/members");
    } catch (err) {
      alert(err?.message || "Failed to delete member");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6">

      {/* Title */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Member Details</h1>

        {/* SuperAdmin Controls */}
        {canEdit && (
          <div className="flex gap-3">
            <button
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
              disabled={busy}
              className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-60"
            >
              {editMode ? (busy ? "Saving..." : "Save Changes") : "Edit Member"}
            </button>

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={busy}
                className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-60"
              >
                {busy ? "Working..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-12 bg-white p-8 rounded-xl shadow-md">

        {/* LEFT — Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={memberObj.img}
            alt={memberObj.name}
            className="w-100 h-[420px] object-cover rounded-xl shadow-md"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              className="mt-3 w-full border rounded p-2"
            />
          )}
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
              disabled={!isAdmin}
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
              disabled={!isAdmin}
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
                  disabled={!isAdmin}
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
                  disabled={!isAdmin}
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
                  disabled={!isAdmin}
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
                  disabled={!isAdmin}
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
                  disabled={!isAdmin}
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
                  disabled={!isAdmin}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

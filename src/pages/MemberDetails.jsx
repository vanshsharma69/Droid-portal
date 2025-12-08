import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMembers } from "../context/MembersContext";

const normalizeMember = (m) => {
  if (!m) return m;
  const id = m.id || m._id;
  const memberId =
    m.memberId !== undefined && m.memberId !== null ? Number(m.memberId) : undefined;
  return { ...m, id, memberId: Number.isNaN(memberId) ? m.memberId : memberId };
};

const memberKey = (m) => m?.id ?? m?._id ?? m?.memberId;

export default function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { members, getMemberById, updateMember, deleteMember, refresh } = useMembers();

  const [member, setMember] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const isAdmin = user && (user.role === "superadmin" || user.role === "admin");

  useEffect(() => {
    const current = getMemberById(id);
    if (current) {
      setMember(normalizeMember(current));
    } else {
      refresh();
    }
  }, [id, getMemberById, refresh]);

  useEffect(() => {
    const latest = getMemberById(id);
    if (latest) setMember(normalizeMember(latest));
  }, [members, id, getMemberById]);

  useEffect(() => {
    if (!newImage) return setImagePreview(null);
    const url = URL.createObjectURL(newImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [newImage]);

  const memberObj = useMemo(
    () => member || getMemberById(id) || {},
    [member, id, getMemberById]
  );

  const birthdayValue = useMemo(() => {
    if (!memberObj?.birthday) return "";
    const d = new Date(memberObj.birthday);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().substring(0, 10);
  }, [memberObj?.birthday]);

  const updateField = (key, value) => {
    setMember((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const fileToDataUrl = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const handleSave = async () => {
    setBusy(true);

    try {
      const payload = { ...memberObj };
      delete payload._id;
      delete payload.id;
      delete payload.img;

      if (newImage) payload.img = await fileToDataUrl(newImage);

      const updated = await updateMember(memberKey(memberObj), payload);

      setMember(normalizeMember(updated || payload));
      setEditMode(false);
      setNewImage(null);
    } catch (err) {
      alert(err?.message || "Error saving changes");
    }

    setBusy(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    setBusy(true);

    try {
      await deleteMember(memberKey(memberObj));
      navigate("/members");
    } catch (err) {
      alert(err?.message || "Error deleting member");
    }

    setBusy(false);
  };

  if (!memberObj?.name) {
    return <h1 className="text-xl font-bold">Member not found</h1>;
  }

  const displayedImg = imagePreview || memberObj.img;
  const today = new Date().toISOString().substring(0, 10);

  // ✨ Nice UI classes
  const labelClass = "font-semibold text-gray-700";
  const valueClass = "text-gray-900";
  const inputClass =
    "border rounded-lg p-2 text-gray-900 w-full bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none";

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Member Details
        </h1>

        {isAdmin && (
          <div className="flex gap-4">
            <button
              className="px-5 py-2 rounded-lg bg-black text-white shadow hover:bg-gray-800 transition"
              disabled={busy}
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
            >
              {editMode ? (busy ? "Saving…" : "Save Changes") : "Edit Member"}
            </button>

            <button
              className="px-5 py-2 rounded-lg bg-red-600 text-white shadow hover:bg-red-700 transition"
              disabled={busy}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col md:flex-row gap-12">
        {/* Left - Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            src={displayedImg}
            alt={memberObj.name}
            className="w-60 h-60 object-cover rounded-2xl shadow-md border"
          />

          {editMode && (
            <input
              type="file"
              accept="image/*"
              className="mt-5 w-full border border-gray-300 p-2 rounded-lg"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
            />
          )}
        </div>

        {/* Right - Information */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* Name + Role */}
          <div>
            {!editMode ? (
              <h2 className="text-3xl font-bold text-gray-900">
                {memberObj.name}
              </h2>
            ) : (
              <input
                type="text"
                value={memberObj.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`${inputClass} text-2xl`}
              />
            )}

            <p className="text-gray-600 text-lg mt-1">{memberObj.role}</p>
          </div>

          {/* Section Divider */}
          <hr className="border-gray-300" />

          {/* Detail Rows */}
          <div className="space-y-5">
            {/* Member ID */}
            <div>
              <span className={labelClass}>Member ID:</span>
              <p className={valueClass}>{memberObj.memberId}</p>
            </div>

            {/* Email */}
            <div>
              <span className={labelClass}>Email:</span>
              <p className={valueClass}>{memberObj.email}</p>
            </div>

            {/* Points */}
            <div>
              <span className={labelClass}>Achievement Points:</span>
              {!editMode ? (
                <p className={valueClass}>{memberObj.points}</p>
              ) : (
                <input
                  type="number"
                  className={inputClass}
                  value={memberObj.points}
                  onChange={(e) => updateField("points", e.target.value)}
                />
              )}
            </div>

            {/* Birthday */}
            <div>
              <span className={labelClass}>Birthday:</span>
              {!editMode ? (
                <p className={valueClass}>{memberObj.birthday || "N/A"}</p>
              ) : (
                <input
                  type="date"
                  className={inputClass}
                  max={today}
                  value={birthdayValue}
                  onChange={(e) => updateField("birthday", e.target.value)}
                />
              )}
            </div>

            {/* College Year */}
            <div>
              <span className={labelClass}>College Year:</span>
              {!editMode ? (
                <p className={valueClass}>{memberObj.year}</p>
              ) : (
                <select
                  value={memberObj.year || ""}
                  className={inputClass}
                  onChange={(e) => updateField("year", e.target.value)}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              )}
            </div>

            {/* Course */}
            <div>
              <span className={labelClass}>Course:</span>
              {!editMode ? (
                <p className={valueClass}>{memberObj.course}</p>
              ) : (
                <input
                  type="text"
                  className={inputClass}
                  value={memberObj.course}
                  onChange={(e) => updateField("course", e.target.value)}
                />
              )}
            </div>

            {/* Instagram */}
            <div>
              <span className={labelClass}>Instagram:</span>
              {!editMode ? (
                <p className={valueClass}>{memberObj.instagram || "N/A"}</p>
              ) : (
                <input
                  type="text"
                  className={inputClass}
                  value={memberObj.instagram}
                  onChange={(e) => updateField("instagram", e.target.value)}
                />
              )}
            </div>

            {/* Bio */}
            <div>
              <span className={labelClass}>Bio:</span>
              {!editMode ? (
                <p className={valueClass}>{memberObj.bio || "N/A"}</p>
              ) : (
                <textarea
                  className={inputClass}
                  value={memberObj.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                />
              )}
            </div>

            {/* Branch */}
            <div>
              <span className={labelClass}>Branch:</span>
              {!editMode ? (
                <p className={valueClass}>{memberObj.branch}</p>
              ) : (
                <input
                  type="text"
                  className={inputClass}
                  value={memberObj.branch}
                  onChange={(e) => updateField("branch", e.target.value)}
                />
              )}
            </div>

            {/* Roll */}
            <div>
              <span className={labelClass}>University Roll No:</span>
              {!editMode ? (
                <p className={valueClass}>{memberObj.roll}</p>
              ) : (
                <input
                  type="text"
                  className={inputClass}
                  value={memberObj.roll}
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

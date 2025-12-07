import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectsContext";
import { useMembers } from "../context/MembersContext";

export default function ProjectDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProjectById, fetchProject, updateProject, deleteProject, projects } = useProjects();
  const { members } = useMembers();

  const [project, setProject] = useState(state?.project || null);
  const [editMode, setEditMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const projectIdKey = (p) => p?.projectId ?? p?.id ?? p?._id;
  const normalizeMemberId = (val) => {
    const raw = typeof val === "object" ? val?.memberId ?? val?.id : val;
    const num = Number(raw);
    return Number.isNaN(num) ? null : num;
  };

  useEffect(() => {
    const lookupId = id || projectIdKey(state?.project);
    const existing = lookupId ? getProjectById(lookupId) || state?.project : state?.project;
    if (existing) {
      setProject(existing);
      return;
    }
    if (!lookupId) return;
    fetchProject(lookupId)
      .then(setProject)
      .catch((err) => setError(err?.message || "Project not found"));
  }, [getProjectById, fetchProject, id, state]);

  useEffect(() => {
    const lookupId = id || projectIdKey(state?.project);
    const latest = lookupId ? getProjectById(lookupId) : null;
    if (latest) setProject(latest);
  }, [projects, getProjectById, id, state]);

  if (error) return <h1 className="text-xl font-bold text-red-600">{error}</h1>;
  if (!project) return <h1 className="text-xl font-bold">Project not found</h1>;

  const assignedIds = Array.isArray(project.assignedMembers)
    ? project.assignedMembers.map((m) => normalizeMemberId(m)).filter((v) => v !== null)
    : [];

  const assignedMembers = assignedIds
    .map((idVal) => members.find((m) => normalizeMemberId(m) === idVal))
    .filter(Boolean);

  const availableMembers = members.filter((m) => {
    const mid = normalizeMemberId(m);
    if (mid === null) return false;
    return !assignedIds.some((idVal) => idVal === mid);
  });

  const updateField = (field, value) => {
    setProject({ ...project, [field]: value });
  };

  const handleSave = async () => {
    setBusy(true);
    setError(null);
    try {
      const pid = projectIdKey(project);
      const pidNum = pid !== undefined && pid !== null ? Number(pid) : null;
      const payload = { ...project, assignedMembers: assignedIds };
      if (!Number.isNaN(pidNum)) {
        payload.projectId = pidNum;
      } else {
        delete payload.projectId;
      }

      await updateProject(pid, payload);
      setEditMode(false);
    } catch (err) {
      setError(err?.message || "Failed to update project");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    setBusy(true);
    try {
      await deleteProject(projectIdKey(project));
      navigate("/projects");
    } catch (err) {
      setError(err?.message || "Failed to delete project");
    } finally {
      setBusy(false);
    }
  };

  const assignMember = (idToAdd) => {
    const normalized = normalizeMemberId(idToAdd);
    if (!normalized) return;
    if (assignedIds.some((v) => v === normalized)) return;
    setProject({ ...project, assignedMembers: [...assignedIds, normalized] });
  };

  const removeMember = (memberId) => {
    setProject({
      ...project,
      assignedMembers: assignedIds.filter((idVal) => idVal !== normalizeMemberId(memberId)),
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-10">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Details</h1>

        {(user?.role === "superadmin" || user?.role === "admin") && (
          <div className="flex gap-3">
            <button
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
              disabled={busy}
              className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-60"
            >
              {editMode ? (busy ? "Saving..." : "Save Changes") : "Edit Project"}
            </button>

            <button
              onClick={handleDelete}
              disabled={busy}
              className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-60"
            >
              {busy ? "Working..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow">

        {!editMode ? (
          <h2 className="text-3xl font-bold">{project.name}</h2>
        ) : (
          <input
            className="w-full p-2 border rounded text-xl font-bold"
            value={project.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
          />
        )}

        {!editMode ? (
          <p className="text-gray-600 mt-2">{project.description}</p>
        ) : (
          <textarea
            className="w-full p-2 border rounded mt-2"
            value={project.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
          />
        )}

        <div className="mt-6 text-lg space-y-2">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {!editMode ? (
              project.status || "Pending"
            ) : (
              <select
                className="border p-2 rounded"
                value={project.status || "Pending"}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option>In Progress</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            )}
          </p>

          <p>
            <span className="font-semibold">Deadline:</span>{" "}
            {!editMode ? (
              project.deadline || "Not set"
            ) : (
              <input
                type="date"
                className="border p-2 rounded"
                value={project.deadline || ""}
                onChange={(e) => updateField("deadline", e.target.value)}
              />
            )}
          </p>
        </div>

        <div className="mt-10">
          <div className="flex justify-between">
            <h3 className="text-2xl font-semibold">Assigned Members</h3>

            {(user?.role === "superadmin" || user?.role === "admin") && availableMembers.length > 0 && (
              <select
                className="border p-2 rounded"
                onChange={(e) => assignMember(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  + Assign Member
                </option>
                {availableMembers.map((m) => (
                  <option key={m.id} value={m.memberId ?? m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <ul className="mt-4 space-y-3">
            {assignedMembers.length === 0 && <li className="text-gray-600">No members assigned.</li>}

            {assignedMembers.map((m) => (
              <li key={m.memberId ?? m.id} className="flex items-center gap-3 p-4 border rounded">
                <img src={m.img} className="w-12 h-12 rounded-full" />

                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-gray-500">{m.role}</p>
                </div>

                {(user?.role === "superadmin" || user?.role === "admin") && (
                  <button
                    onClick={() => removeMember(m.memberId ?? m.id)}
                    className="ml-auto px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

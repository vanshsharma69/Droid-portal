import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Clock } from "lucide-react";
import { useProjects } from "../context/ProjectsContext";
import { useMembers } from "../context/MembersContext";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

export default function Projects() {
  const { user } = useAuth();
  const { projects, loading, error, refresh, createProject } = useProjects();
  const { members } = useMembers();
  const [showAdd, setShowAdd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", status: "Pending", deadline: "" });

  useEffect(() => {
    refresh();
  }, [refresh]);

  const allProjects = projects.map((p) => {
    const pid = p.projectId ?? p.id ?? p._id;
    const ids = Array.isArray(p.assignedMembers) ? p.assignedMembers : [];
    const assignedMembers = ids
      .map((idOrObj) => {
        if (typeof idOrObj === "object") return idOrObj;
        return members.find((m) => String(m.memberId ?? m.id) === String(idOrObj));
      })
      .filter(Boolean);

    return { ...p, projectId: pid, assignedMembers };
  });

  const statusBadge = (status) => {
    if (status === "Completed")
      return "bg-green-100 text-green-700 border-green-300";
    if (status === "In Progress")
      return "bg-blue-100 text-blue-700 border-blue-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>

        {(user?.role === "superadmin" || user?.role === "admin") && (
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-black text-white rounded-lg shadow hover:opacity-85 transition"
          >
            + Add Project
          </button>
        )}
      </div>

      {loading && <p className="text-gray-600">Loading projects...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

        {allProjects.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.projectId ?? p.id ?? p._id}`}
            state={{ project: p }}
            className="block"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 
                hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer">

              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <FolderKanban className="w-6 h-6 text-gray-700" />
                </div>
                <h2 className="text-xl font-semibold">{p.name}</h2>
              </div>

              <div className="mt-4">

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${statusBadge(
                    p.status
                  )}`}
                >
                  {p.status}
                </span>

                {/* Deadline */}
                <div className="flex items-center gap-2 mt-3 text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    Deadline: {""}
                    <span className="font-semibold text-black">{p.deadline || "N/A"}</span>
                  </span>
                </div>

                {/* Members count */}
                <p className="text-sm text-gray-700 mt-3 font-medium">
                  Members Assigned: {p.assignedMembers.length}
                </p>

                {/* Avatars */}
                <div className="flex mt-2 -space-x-3">
                  {p.assignedMembers.slice(0, 3).map((m, i) => (
                    <img
                      key={i}
                      src={m.img}
                      className="w-10 h-10 rounded-full border-2 border-white shadow"
                    />
                  ))}

                  {p.assignedMembers.length > 3 && (
                    <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm text-gray-600 shadow">
                      +{p.assignedMembers.length - 3}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </Link>
        ))}

      </div>

      <Modal
        open={showAdd}
        title="Add Project"
        onClose={() => setShowAdd(false)}
        footer={(
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAdd(false)} type="button" className="px-4 py-2 rounded border">
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!form.name) return alert("Name is required");
                try {
                  setBusy(true);
                  await createProject(form);
                  setForm({ name: "", description: "", status: "Pending", deadline: "" });
                  setShowAdd(false);
                } catch (err) {
                  alert(err?.message || "Failed to create project");
                } finally {
                  setBusy(false);
                }
              }}
              disabled={busy}
              type="button"
              className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            >
              {busy ? "Creating..." : "Create"}
            </button>
          </div>
        )}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              className="w-full rounded-lg border p-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full rounded-lg border p-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                className="w-full rounded-lg border p-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                className="w-full rounded-lg border p-2"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

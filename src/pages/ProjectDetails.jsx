import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { members } from "../Data/members";

export default function ProjectDetails() {
  const { state } = useLocation();
  const { user } = useAuth();
  const p = state?.project;

  if (!p) return <h1 className="text-xl font-bold">Project not found</h1>;

  // Local state for editing
  const [project, setProject] = useState({ ...p });
  const [editMode, setEditMode] = useState(false);

  // Update field
  const update = (field, value) => {
    setProject({ ...project, [field]: value });
  };

  // BUGS CRUD
  const addBug = () => {
    const title = prompt("Bug title?");
    if (!title) return;
    const bug = { bugId: Date.now(), title, status: "Open" };
    setProject({
      ...project,
      bugs: [...project.bugs, bug]
    });
  };

  const toggleBugStatus = (index) => {
    const updated = [...project.bugs];
    updated[index].status = updated[index].status === "Open" ? "Resolved" : "Open";
    setProject({ ...project, bugs: updated });
  };

  const deleteBug = (index) => {
    if (!confirm("Delete this bug?")) return;
    setProject({
      ...project,
      bugs: project.bugs.filter((_, i) => i !== index)
    });
  };

  // FEEDBACK CRUD
  const addFeedback = () => {
    const by = prompt("Feedback by:");
    if (!by) return;
    const text = prompt("Feedback message:");
    if (!text) return;
    const stars = Number(prompt("Rating (1-5):"));

    const fb = { by, text, stars };
    setProject({ ...project, feedback: [...project.feedback, fb] });
  };

  const deleteFeedback = (index) => {
    if (!confirm("Delete feedback?")) return;
    setProject({
      ...project,
      feedback: project.feedback.filter((_, i) => i !== index)
    });
  };

  // MEMBER ASSIGNMENT CRUD
  const assignMember = () => {
    const available = members.filter(
      (m) => !project.assignedMembers.some((am) => am.id === m.id)
    );

    if (available.length === 0) {
      alert("No more members to assign");
      return;
    }

    const names = available.map((m) => m.name).join("\n");
    const selected = prompt(
      "Select a member to assign:\n\n" + names
    );
    if (!selected) return;

    const found = available.find((m) => m.name === selected);
    if (!found) return alert("Invalid name");

    setProject({
      ...project,
      assignedMembers: [...project.assignedMembers, found]
    });
  };

  const removeMember = (id) => {
    if (!confirm("Remove member from this project?")) return;
    setProject({
      ...project,
      assignedMembers: project.assignedMembers.filter((m) => m.id !== id)
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Details</h1>

        {user?.role === "superadmin" && (
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            {editMode ? "Save Changes" : "Edit Project"}
          </button>
        )}
      </div>

      {/* MAIN CARD */}
      <div className="bg-white p-6 rounded-lg shadow">

        {/* PROJECT NAME */}
        {!editMode ? (
          <h2 className="text-3xl font-bold">{project.name}</h2>
        ) : (
          <input
            className="w-full p-2 border rounded text-xl font-bold"
            value={project.name}
            onChange={(e) => update("name", e.target.value)}
          />
        )}

        {/* DESCRIPTION */}
        {!editMode ? (
          <p className="text-gray-600 mt-2">{project.description}</p>
        ) : (
          <textarea
            className="w-full p-2 border rounded mt-2"
            value={project.description}
            onChange={(e) => update("description", e.target.value)}
          />
        )}

        {/* STATUS + DEADLINE */}
        <div className="mt-6 space-y-2 text-lg">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {!editMode ? (
              project.status
            ) : (
              <select
                className="border p-2 rounded"
                value={project.status}
                onChange={(e) => update("status", e.target.value)}
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
              project.deadline
            ) : (
              <input
                type="date"
                className="border p-1 rounded"
                value={project.deadline}
                onChange={(e) => update("deadline", e.target.value)}
              />
            )}
          </p>
        </div>

        {/* BUGS SECTION */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Bugs</h3>

            {user?.role === "superadmin" && (
              <button
                onClick={addBug}
                className="px-3 py-1 bg-black text-white rounded"
              >
                + Add Bug
              </button>
            )}
          </div>

          <ul className="mt-4 space-y-3">
            {project.bugs.map((b, i) => (
              <li
                key={b.bugId}
                className="p-4 border rounded flex justify-between items-center"
              >
                <span>{b.title}</span>

                <div className="flex gap-3 items-center">
                  <span
                    className={
                      b.status === "Open"
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {b.status}
                  </span>

                  {user?.role === "superadmin" && (
                    <>
                      <button
                        onClick={() => toggleBugStatus(i)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => deleteBug(i)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* FEEDBACK SECTION */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Feedback</h3>

            {user?.role === "superadmin" && (
              <button
                onClick={addFeedback}
                className="px-3 py-1 bg-black text-white rounded"
              >
                + Add Feedback
              </button>
            )}
          </div>

          <ul className="mt-4 space-y-3">
            {project.feedback.map((fb, i) => (
              <li key={i} className="p-4 border rounded">
                <p className="font-semibold">{fb.by}</p>
                <p className="text-gray-600">{fb.text}</p>
                <p className="text-yellow-600 font-semibold">⭐ {fb.stars}</p>

                {user?.role === "superadmin" && (
                  <button
                    onClick={() => deleteFeedback(i)}
                    className="mt-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ASSIGNED MEMBERS */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold">Assigned Members</h3>

            {user?.role === "superadmin" && (
              <button
                onClick={assignMember}
                className="px-3 py-1 bg-black text-white rounded"
              >
                + Assign Member
              </button>
            )}
          </div>

          <ul className="mt-4 space-y-3">
            {project.assignedMembers.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 p-4 border rounded"
              >
                <img
                  src={m.img}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-gray-500">{m.role}</p>
                </div>

                {user?.role === "superadmin" && (
                  <button
                    onClick={() => removeMember(m.id)}
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

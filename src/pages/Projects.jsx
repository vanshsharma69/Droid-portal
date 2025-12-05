import { Link } from "react-router-dom";
import { FolderKanban, Clock } from "lucide-react";
// import { useMembers } from "../context/MembersContext";

export default function Projects() {
  const { members } = useMembers();  // <-- GLOBAL members

  const allProjects = [];

  members.forEach((m) => {
    m.projects.forEach((p) => {
      const exists = allProjects.find((proj) => proj.projectId === p.projectId);

      if (!exists) {
        allProjects.push({
          ...p,
          assignedMembers: [m],
        });
      } else {
        exists.assignedMembers.push(m);
      }
    });
  });

  // Badge colors
  const statusBadge = (status) => {
    if (status === "Completed")
      return "bg-green-100 text-green-700 border-green-300";
    if (status === "In Progress")
      return "bg-blue-100 text-blue-700 border-blue-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

        {allProjects.map((p) => (
          <Link
            key={p.projectId}
            to={`/projects/${p.projectId}`}
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
                    Deadline:{" "}
                    <span className="font-semibold text-black">{p.deadline}</span>
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
    </div>
  );
}

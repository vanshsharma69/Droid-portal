import { useLocation } from "react-router-dom";

export default function EventDetails() {
  const { state } = useLocation();
  const event = state?.event;

  if (!event) return <h1 className="text-xl font-bold">Event not found</h1>;

  return (
    <div className="max-w-6xl mx-auto py-4">

      <h1 className="text-3xl font-bold mb-6">{event.name}</h1>

      {/* Event Info Card */}
      <div className="bg-white p-6 rounded-lg shadow mb-10">

        <p className="text-lg">
          <span className="font-semibold">Responsibility:</span>{" "}
          {event.responsibility}
        </p>

        <p className="text-lg mt-1">
          <span className="font-semibold">Attended:</span>{" "}
          {event.attended ? "Yes" : "No"}
        </p>

      </div>

      {/* Members */}
      <h2 className="text-2xl font-semibold mb-4">Assigned Members</h2>

      <div className="bg-white p-6 rounded-lg shadow">
        {event.assignedMembers.length === 0 ? (
          <p className="text-gray-600">No members assigned.</p>
        ) : (
          <ul className="space-y-3">
            {event.assignedMembers.map((m, i) => (
              <li
                key={i}
                className="flex items-center gap-4 p-3 border rounded-md bg-gray-50"
              >
                <img
                  src={m.img}
                  className="w-14 h-14 rounded-full object-cover shadow"
                />

                <div>
                  <p className="text-lg font-semibold">{m.name}</p>
                  <p className="text-gray-600 text-sm">{m.role}</p>
                  <p className="text-gray-500 text-sm">
                    Responsibility: {m.responsibility}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

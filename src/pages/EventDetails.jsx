import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { members } from "../Data/members";
import { events } from "../Data/events";
import { eventAttendance } from "../Data/attendance";
import { useState } from "react";

export default function EventDetails() {
  const { state } = useLocation();
  const { user } = useAuth();

  const eventFromList = state?.event;
  const event = events.find((e) => e.id === eventFromList?.id);

  if (!event) {
    return <h1 className="text-xl font-bold mt-10 text-center">Event Not Found</h1>;
  }

  // GET assigned members from attendance table
  const initialAssigned = eventAttendance
    .filter((ea) => ea.eventId === event.id)
    .map((ea) => ({
      ...ea,
      member: members.find((m) => m.id === ea.memberId),
    }));

  const [assigned, setAssigned] = useState(initialAssigned);

  // ASSIGN MEMBER
  const assignMember = () => {
    const id = Number(prompt("Enter Member ID to Assign:"));
    const member = members.find((m) => m.id === id);

    if (!member) return alert("Member not found!");

    setAssigned([
      ...assigned,
      { eventId: event.id, memberId: member.id, attended: false, member }
    ]);
  };

  // REMOVE MEMBER
  const removeMember = (index) => {
    if (!confirm("Remove this member from event?")) return;
    setAssigned(assigned.filter((_, i) => i !== index));
  };

  // TOGGLE ATTENDANCE
  const toggleAttendance = (index) => {
    const updated = [...assigned];
    updated[index].attended = !updated[index].attended;
    setAssigned(updated);
  };

  return (
    <div className="max-w-6xl mx-auto py-6">

      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-8">{event.name}</h1>

      {/* EVENT CARD */}
      <div className="bg-white p-6 rounded-xl shadow mb-10 border border-gray-200">
        <p className="text-lg">
          <span className="font-semibold">Event Type:</span> {event.type || "General"}
        </p>

        <p className="text-lg mt-1">
          <span className="font-semibold">Total Assigned Members:</span>{" "}
          {assigned.length}
        </p>

        {user?.role === "superadmin" && (
          <button
            onClick={assignMember}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
          >
            + Assign Member
          </button>
        )}
      </div>

      {/* MEMBER LIST */}
      <h2 className="text-2xl font-semibold mb-4">Assigned Members</h2>

      <div className="bg-white p-6 rounded-xl shadow border">

        {assigned.length === 0 ? (
          <p className="text-gray-600">No members assigned.</p>
        ) : (
          <ul className="space-y-4">

            {assigned.map((record, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg"
              >
                {/* Member Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={record.member.img}
                    className="w-14 h-14 rounded-full object-cover shadow"
                  />

                  <div>
                    <p className="text-lg font-semibold">{record.member.name}</p>
                    <p className="text-gray-500 text-sm">{record.member.role}</p>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        record.attended ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {record.attended ? "Attended" : "Not Attended"}
                    </p>
                  </div>
                </div>

                {/* Admin Actions */}
                {user?.role === "superadmin" && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAttendance(index)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => removeMember(index)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            ))}

          </ul>
        )}

      </div>
    </div>
  );
}

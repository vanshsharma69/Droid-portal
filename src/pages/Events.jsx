import { Link } from "react-router-dom";
import { events } from "../Data/events";
import { eventAttendance } from "../Data/attendance";
import { members } from "../Data/members";
import { CalendarDays } from "lucide-react";

export default function Events() {
  
  // Combine events + assigned members + attendance
  const eventList = events.map((ev) => {
    // Find all attendance records for this event
    const assignedMembers = eventAttendance
      .filter(a => a.eventId === ev.id)
      .map(a => {
        const member = members.find(m => m.id === a.memberId);
        return {
          ...member,
          attended: a.attended
        };
      });

    return {
      ...ev,
      assignedMembers
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {eventList.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {eventList.map((ev) => (
            <Link
              key={ev.id}
              to={`/events/${ev.id}`}
              state={{ event: ev }}
              className="block"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200 cursor-pointer">

                {/* Icon + Name */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-100">
                    <CalendarDays className="w-6 h-6 text-gray-700" />
                  </div>
                  <h2 className="text-xl font-semibold">{ev.name}</h2>
                </div>

                <div className="w-full h-px bg-gray-200 my-4"></div>

                {/* Event Info */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>
                    <span className="font-semibold">Assigned Members:</span>{" "}
                    {ev.assignedMembers.length}
                  </p>

                  <p>
                    <span className="font-semibold">Event Type:</span>{" "}
                    {ev.type || "General"}
                  </p>
                </div>

                {/* Members Preview */}
                <div className="flex mt-4 -space-x-3">
                  {ev.assignedMembers.slice(0, 3).map((m, i) => (
                    <img
                      key={i}
                      src={m.img}
                      className="w-10 h-10 rounded-full border-2 border-white shadow"
                    />
                  ))}

                  {ev.assignedMembers.length > 3 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                      +{ev.assignedMembers.length - 3}
                    </div>
                  )}
                </div>

              </div>
            </Link>
          ))}

        </div>
      )}
    </div>
  );
}

import { members } from "../Data/members";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export default function Events() {
  // Extract unique events + assigned members
  const eventsMap = {};

  members.forEach((m) => {
    m.events.forEach((e) => {
      if (!eventsMap[e.eventId]) {
        eventsMap[e.eventId] = {
          ...e,
          assignedMembers: [
            {
              id: m.id,
              name: m.name,
              role: m.role,
              img: m.img,
              responsibility: e.responsibility,
            },
          ],
        };
      } else {
        eventsMap[e.eventId].assignedMembers.push({
          id: m.id,
          name: m.name,
          role: m.role,
          img: m.img,
          responsibility: e.responsibility,
        });
      }
    });
  });

  const events = Object.values(eventsMap);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {events.map((e) => (
            <Link
              key={e.eventId}
              to={`/events/${e.eventId}`}
              state={{ event: e }}
              className="block"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 cursor-pointer">

                {/* Icon + Event Name */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-100">
                    <CalendarDays className="w-6 h-6 text-gray-700" />
                  </div>

                  <h2 className="text-xl font-semibold">{e.name}</h2>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 my-4"></div>

                {/* Details */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>
                    <span className="font-semibold">Team Members:</span>{" "}
                    {e.assignedMembers.length}
                  </p>

                  <p>
                    <span className="font-semibold">Attended:</span>{" "}
                    <span
                      className={
                        e.attended ? "text-green-600" : "text-red-600"
                      }
                    >
                      {e.attended ? "Yes" : "No"}
                    </span>
                  </p>
                </div>

                {/* Assigned Member Preview */}
                <div className="flex mt-4 -space-x-3">
                  {e.assignedMembers.slice(0, 3).map((m, i) => (
                    <img
                      key={i}
                      src={m.img}
                      className="w-10 h-10 rounded-full border-2 border-white shadow"
                    />
                  ))}

                  {e.assignedMembers.length > 3 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                      +{e.assignedMembers.length - 3}
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

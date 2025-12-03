import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function AttendanceDetails() {
  const { state } = useLocation();
  const { user } = useAuth(); // detect role
  const m = state?.m;

  if (!m) {
    return <h1 className="text-xl font-bold text-center mt-10">Member not found</h1>;
  }

  // LOCAL STATE FOR EDITING
  const [daily, setDaily] = useState([...m.attendance.daily]);
  const [events, setEvents] = useState([...m.events]);

  // SUMMARY
  const totalDays = daily.length;
  const presentDays = daily.filter((d) => d.present).length;
  const percent = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  // ADD NEW DAILY ENTRY
  const addNewDay = () => {
    const today = prompt("Enter date (YYYY-MM-DD):");
    if (!today) return;

    const present = confirm("Mark present? OK = Present, Cancel = Absent");

    const newEntry = { date: today, present };
    setDaily([...daily, newEntry]);
  };

  // DELETE DAY
  const deleteDay = (index) => {
    if (!confirm("Delete this entry?")) return;
    setDaily(daily.filter((_, i) => i !== index));
  };

  // TOGGLE PRESENT/ABSENT
  const toggleDay = (index) => {
    const updated = [...daily];
    updated[index].present = !updated[index].present;
    setDaily(updated);
  };

  // ADD EVENT ATTENDANCE
  const addNewEvent = () => {
    const name = prompt("Enter event name:");
    if (!name) return;

    const attended = confirm("Mark attended? OK = Yes, Cancel = No");

    const newEvent = {
      name,
      attended,
      eventId: Date.now()
    };

    setEvents([...events, newEvent]);
  };

  // DELETE EVENT
  const deleteEvent = (index) => {
    if (!confirm("Delete this event attendance?")) return;
    setEvents(events.filter((_, i) => i !== index));
  };

  // TOGGLE EVENT
  const toggleEvent = (index) => {
    const updated = [...events];
    updated[index].attended = !updated[index].attended;
    setEvents(updated);
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Attendance Details</h1>

      {/* MEMBER CARD */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 shadow rounded-lg mb-10">
        <img
          src={m.img}
          alt={m.name}
          className="w-36 h-36 rounded-full object-cover shadow-lg"
        />

        <div>
          <h2 className="text-2xl font-bold">{m.name}</h2>
          <p className="text-gray-600">{m.role}</p>

          <div className="mt-4 text-gray-700 space-y-1">
            <p><span className="font-semibold">Attendance %:</span> {percent}%</p>
            <p><span className="font-semibold">Present:</span> {presentDays} days</p>
            <p><span className="font-semibold">Absent:</span> {totalDays - presentDays} days</p>
          </div>
        </div>
      </div>

      {/* DAILY ATTENDANCE */}
      <div className="bg-white p-6 shadow rounded-lg mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Daily Attendance</h3>

          {user?.role === "superadmin" && (
            <button
              onClick={addNewDay}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              + Add Day
            </button>
          )}
        </div>

        <ul className="space-y-2">
          {daily.map((d, i) => (
            <li 
              key={i}
              className="flex justify-between p-3 border rounded-md bg-gray-50 items-center"
            >
              <span>{d.date}</span>

              <div className="flex items-center gap-3">
                <span className={d.present ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {d.present ? "Present" : "Absent"}
                </span>

                {user?.role === "superadmin" && (
                  <>
                    <button
                      onClick={() => toggleDay(i)}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => deleteDay(i)}
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

      {/* EVENT ATTENDANCE */}
      <div className="bg-white p-6 shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Event Attendance</h3>

          {user?.role === "superadmin" && (
            <button
              onClick={addNewEvent}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              + Add Event
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <p className="text-gray-500">No event attendance recorded.</p>
        ) : (
          <ul className="space-y-2">
            {events.map((e, i) => (
              <li 
                key={i}
                className="flex justify-between p-3 border rounded-md bg-gray-50 items-center"
              >
                <span>{e.name}</span>

                <div className="flex items-center gap-3">
                  <span className={e.attended ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {e.attended ? "Attended" : "Missed"}
                  </span>

                  {user?.role === "superadmin" && (
                    <>
                      <button
                        onClick={() => toggleEvent(i)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => deleteEvent(i)}
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
        )}
      </div>

    </div>
  );
}

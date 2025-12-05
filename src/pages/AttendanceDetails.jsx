import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { dailyAttendance } from "../Data/attendance";
import { eventAttendance } from "../Data/attendance"; 
import { events } from "../Data/events";

export default function AttendanceDetails() {
  const { state } = useLocation();
  const { user } = useAuth();

  const member = state?.member;

  if (!member) {
    return <h1 className="text-xl font-bold text-center mt-10">Member not found</h1>;
  }

  // FILTER DAILY ATTENDANCE FOR THIS MEMBER
  const initialDaily = dailyAttendance.filter(d => d.memberId === member.id);

  const initialEventAttendance = eventAttendance
    .filter(e => e.memberId === member.id)
    .map(e => ({
      ...e,
      name: events.find(evt => evt.id === e.eventId)?.name || "Unknown Event"
    }));

  const [daily, setDaily] = useState(initialDaily);
  const [eventData, setEventData] = useState(initialEventAttendance);

  // SUMMARY
  const totalDays = daily.length;
  const presentDays = daily.filter(d => d.present).length;
  const percent = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  // ADD NEW DAILY ENTRY
  const addNewDay = () => {
    const date = prompt("Enter date (YYYY-MM-DD):");
    if (!date) return;

    const present = confirm("Mark present? OK = Present, Cancel = Absent");

    const newEntry = { memberId: member.id, date, present };
    setDaily([...daily, newEntry]);
  };

  // DELETE DAY
  const deleteDay = (index) => {
    if (!confirm("Delete this entry?")) return;
    setDaily(daily.filter((_, i) => i !== index));
  };

  // TOGGLE PRESENT
  const toggleDay = (index) => {
    const updated = [...daily];
    updated[index].present = !updated[index].present;
    setDaily(updated);
  };

  // ADD EVENT ATTENDANCE
  const addNewEvent = () => {
    const eventId = Number(prompt("Enter Event ID:"));
    if (!eventId) return;

    const eventObj = events.find(e => e.id === eventId);
    if (!eventObj) return alert("Event not found!");

    const attended = confirm("Mark attended? OK = Yes, Cancel = No");

    const newEvent = {
      memberId: member.id,
      eventId,
      name: eventObj.name,
      attended
    };

    setEventData([...eventData, newEvent]);
  };

  // DELETE EVENT ENTRY
  const deleteEvent = (index) => {
    if (!confirm("Delete this event attendance?")) return;
    setEventData(eventData.filter((_, i) => i !== index));
  };

  // TOGGLE EVENT ATTENDANCE
  const toggleEvent = (index) => {
    const updated = [...eventData];
    updated[index].attended = !updated[index].attended;
    setEventData(updated);
  };

  return (
    <div className="max-w-6xl mx-auto py-10">

      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-8">Attendance Details</h1>

      {/* MEMBER CARD */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 shadow rounded-lg mb-10">
        <img src={member.img} alt={member.name} className="w-36 h-36 rounded-full shadow" />

        <div>
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <p className="text-gray-600">{member.role}</p>

          <div className="mt-4 text-gray-700 space-y-1">
            <p><strong>Attendance %:</strong> {percent}%</p>
            <p><strong>Present:</strong> {presentDays} days</p>
            <p><strong>Absent:</strong> {totalDays - presentDays} days</p>
          </div>
        </div>
      </div>

      {/* DAILY ATTENDANCE */}
      <div className="bg-white p-6 rounded-lg shadow mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Daily Attendance</h3>

          {user?.role === "superadmin" && (
            <button onClick={addNewDay} className="px-4 py-2 bg-black text-white rounded-lg">
              + Add Day
            </button>
          )}
        </div>

        <ul className="space-y-2">
          {daily.map((d, i) => (
            <li key={i} className="flex justify-between items-center p-3 bg-gray-50 border rounded">
              <span>{d.date}</span>

              <div className="flex items-center gap-3">
                <span className={d.present ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {d.present ? "Present" : "Absent"}
                </span>

                {user?.role === "superadmin" && (
                  <>
                    <button onClick={() => toggleDay(i)} className="text-blue-600 text-xs">Toggle</button>
                    <button onClick={() => deleteDay(i)} className="text-red-600 text-xs">Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* EVENT ATTENDANCE */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Event Attendance</h3>

          {user?.role === "superadmin" && (
            <button onClick={addNewEvent} className="px-4 py-2 bg-black text-white rounded-lg">
              + Add Event
            </button>
          )}
        </div>

        {eventData.length === 0 ? (
          <p className="text-gray-500">No event attendance recorded.</p>
        ) : (
          <ul className="space-y-2">
            {eventData.map((e, i) => (
              <li key={i} className="flex justify-between items-center p-3 bg-gray-50 border rounded">
                <span>{e.name}</span>

                <div className="flex items-center gap-3">
                  <span className={e.attended ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                    {e.attended ? "Attended" : "Missed"}
                  </span>

                  {user?.role === "superadmin" && (
                    <>
                      <button onClick={() => toggleEvent(i)} className="text-blue-600 text-xs">Toggle</button>
                      <button onClick={() => deleteEvent(i)} className="text-red-600 text-xs">Delete</button>
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

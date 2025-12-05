import { members } from "../Data/members";
import { events } from "../Data/events";
import { projects } from "../Data/projects";
import { dailyAttendance, eventAttendance } from "../Data/attendance";

export default function Dashboard() {
  // TOTAL MEMBERS
  const totalMembers = members.length;

  // TOTAL PROJECTS
  const totalProjects = projects.length;

  // TOTAL EVENTS
  const totalEvents = events.length;

  // AVG ATTENDANCE (daily)
  const avgAttendance = (() => {
    const totalDays = dailyAttendance.length;
    const presentDays = dailyAttendance.filter((a) => a.present).length;

    if (totalDays === 0) return 0;
    return Math.round((presentDays / totalDays) * 100);
  })();

  // TOP MEMBER BASED ON POINTS
  const topMember = [...members].sort((a, b) => b.points - a.points)[0];

  // UPCOMING EVENTS (show first 3)
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="text-black">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-700 mt-2">Welcome to Droid Club Management Portal</p>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        
        {/* Members */}
        <div className="bg-white p-5 shadow rounded-xl border">
          <p className="text-gray-500">Total Members</p>
          <h2 className="text-3xl font-bold mt-2">{totalMembers}</h2>
        </div>

        {/* Projects */}
        <div className="bg-white p-5 shadow rounded-xl border">
          <p className="text-gray-500">Total Projects</p>
          <h2 className="text-3xl font-bold mt-2">{totalProjects}</h2>
        </div>

        {/* Events */}
        <div className="bg-white p-5 shadow rounded-xl border">
          <p className="text-gray-500">Total Events</p>
          <h2 className="text-3xl font-bold mt-2">{totalEvents}</h2>
        </div>

        {/* Attendance */}
        <div className="bg-white p-5 shadow rounded-xl border">
          <p className="text-gray-500">Avg Attendance</p>
          <h2 className="text-3xl font-bold mt-2">{avgAttendance}%</h2>
        </div>
      </div>

      {/* TOP MEMBER */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-semibold mb-4">Top Member</h2>

        <div className="flex items-center gap-6">
          <img
            src={topMember.img}
            className="w-20 h-20 rounded-full object-cover shadow"
          />
          <div>
            <p className="text-xl font-bold">{topMember.name}</p>
            <p className="text-gray-600">{topMember.role}</p>
            <p className="mt-1 text-gray-700">
              Points: <span className="font-semibold">{topMember.points}</span>
            </p>
          </div>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow border">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>

        {upcomingEvents.length === 0 ? (
          <p className="text-gray-600">No upcoming events.</p>
        ) : (
          <ul className="space-y-3">
            {upcomingEvents.map((e) => (
              <li
                key={e.id}
                className="flex justify-between p-4 border rounded-lg bg-gray-50"
              >
                <span className="font-semibold">{e.name}</span>
                <span className="text-gray-600">{e.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

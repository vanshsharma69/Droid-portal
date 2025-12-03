import { members } from "../Data/members";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, BarChart3 } from "lucide-react";

export default function Attendance() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>

      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          Member Attendance Overview
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {members.map((m) => {
            const total = m.attendance.daily.length;
            const present = m.attendance.daily.filter(a => a.present).length;
            const percent = total > 0 ? ((present / total) * 100).toFixed(0) : 0;

            return (
              <Link
                key={m.id}
                to={`/attendance/${m.id}`}
                state={{ m }}
                className="block"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200
                  hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer">

                  {/* Top: Member */}
                  <div className="flex items-center gap-4">
                    <img
                      src={m.img}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                    />
                    <div>
                      <p className="font-semibold text-lg">{m.name}</p>
                      <p className="text-sm text-gray-600">{m.role}</p>
                    </div>
                  </div>

                  {/* Attendance Stats */}
                  <div className="mt-5 space-y-2 text-gray-700 text-sm">

                    {/* Percentage Badge */}
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-300">
                      {percent}% Attendance
                    </div>

                    <p>
                      <span className="font-semibold">Present:</span> {present} days
                    </p>
                    <p>
                      <span className="font-semibold">Absent:</span> {total - present} days
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                  </div>

                </div>
              </Link>
            );
          })}

        </div>

      </div>
    </div>
  );
}

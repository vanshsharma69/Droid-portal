import { Link } from "react-router-dom";
import { members } from "../Data/members";  // <-- import data

export default function Members() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Members</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m, index) => (
          <Link
            key={index}
            to={`/members/${index}`}
            state={{ m }}
          >
            <div className="cursor-pointer bg-white shadow-sm hover:shadow-lg p-4 rounded-xl transition">

              <img
                src={m.img}
                alt={m.name}
                className="w-full h-80 object-cover rounded-xl"
              />

              <h2 className="text-xl font-bold mt-3">{m.name}</h2>
              <p className="text-gray-600">{m.role}</p>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

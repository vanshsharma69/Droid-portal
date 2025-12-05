import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const res = login(email, password);

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-full max-w-md shadow-lg rounded-xl p-8 border">

        <h1 className="text-2xl font-bold text-center mb-6">Droid Portal Login</h1>

        {error && (
          <p className="text-red-600 text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="admin@droid.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

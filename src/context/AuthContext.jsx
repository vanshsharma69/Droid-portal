import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load stored user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("droidUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // LOGIN FUNCTION
  const login = (email, password) => {
    // SUPER ADMIN LOGIN
    if (email === "admin@droid.com" && password === "admin123") {
      const userData = {
        email,
        role: "superadmin", // <-- SUPER ADMIN ROLE
      };
      setUser(userData);
      localStorage.setItem("droidUser", JSON.stringify(userData));
      return { success: true };
    }

    // NORMAL MEMBER LOGIN (optional)
    if (email === "member@droid.com" && password === "123456") {
      const userData = {
        email,
        role: "member", // <-- NORMAL MEMBER ROLE
      };
      setUser(userData);
      localStorage.setItem("droidUser", JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: "Invalid Credentials" };
  };

  // LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    localStorage.removeItem("droidUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// USE AUTH HOOK
export function useAuth() {
  return useContext(AuthContext);
}

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Projects from "./pages/Projects";
import Events from "./pages/Events";

import MemberDetails from "./pages/MemberDetails";
import ProjectDetails from "./pages/ProjectDetails";
import AttendanceDetails from "./pages/AttendanceDetails";
import EventDetails from "./pages/EventDetails";

import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/login" element={<Login />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/members"
        element={
          <PrivateRoute>
            <Layout>
              <Members />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/members/:id"
        element={
          <PrivateRoute>
            <Layout>
              <MemberDetails />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <Layout>
              <Attendance />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/attendance/:id"
        element={
          <PrivateRoute>
            <Layout>
              <AttendanceDetails />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <Layout>
              <Projects />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <PrivateRoute>
            <Layout>
              <ProjectDetails />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/events"
        element={
          <PrivateRoute>
            <Layout>
              <Events />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/events/:id"
        element={
          <PrivateRoute>
            <Layout>
              <EventDetails />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <PrivateRoute>
            <Layout>
              <Leaderboard />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const ProjectsContext = createContext(null);

const projectKey = (project) => project?.projectId ?? project?.id ?? project?._id;
const sameProject = (proj, id) => String(projectKey(proj)) === String(id);

export function ProjectsProvider({ children }) {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProjects(token);
      setProjects(Array.isArray(res) ? res : res?.projects || []);
    } catch (err) {
      setError(err?.message || "Failed to fetch projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const fetchProject = useCallback(
    async (id) => {
      const res = await api.getProject(id, token);
      const project = res?.project || res;
      if (project) {
        setProjects((prev) => {
          const exists = prev.find((p) => sameProject(p, projectKey(project)));
          if (exists) {
            return prev.map((p) => (sameProject(p, projectKey(project)) ? project : p));
          }
          return [...prev, project];
        });
      }
      return project;
    },
    [token]
  );

  const createProject = useCallback(
    async (payload) => {
      const res = await api.createProject(payload, token);
      const created = res?.project || res;
      if (created) setProjects((prev) => [...prev, created]);
      return created;
    },
    [token]
  );

  const updateProject = useCallback(
    async (id, payload) => {
      const res = await api.updateProject(id, payload, token);
      const updated = res?.project || res;
      setProjects((prev) => prev.map((p) => (sameProject(p, id) ? { ...p, ...updated } : p)));
      return updated;
    },
    [token]
  );

  const deleteProject = useCallback(
    async (id) => {
      await api.deleteProject(id, token);
      setProjects((prev) => prev.filter((p) => !sameProject(p, id)));
    },
    [token]
  );

  const getProjectById = (id) => projects.find((p) => sameProject(p, id));

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        loading,
        error,
        refresh,
        fetchProject,
        createProject,
        updateProject,
        deleteProject,
        getProjectById,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used inside ProjectsProvider");
  return ctx;
}

export const projects = [
  {
    id: 201,
    name: "Club Website Revamp",
    description: "Updating UI/UX and backend.",
    status: "In Progress",
    deadline: "2025-02-10",
    assignedMembers: [1], 
    bugs: [
      { id: 1, title: "Navbar overlap", status: "Open" },
      { id: 2, title: "Login redirect issue", status: "Resolved" },
    ],
    feedback: [
      { by: 1, text: "Excellent leadership", stars: 5 },
      { by: 2, text: "Coordinating very well", stars: 4 },
    ],
  },

  {
    id: 202,
    name: "Droid Portal Backend",
    description: "Building API authentication and database models.",
    status: "Completed",
    deadline: "2025-01-10",
    assignedMembers: [2],
    bugs: [{ id: 1, title: "Token refresh issue", status: "Resolved" }],
    feedback: [{ by: 1, text: "Great backend work!", stars: 5 }],
  },

  {
    id: 203,
    name: "Droid App UI",
    description: "Designing entire club portal UI/UX.",
    status: "In Progress",
    deadline: "2025-02-20",
    assignedMembers: [3],
    bugs: [{ id: 1, title: "Misaligned card", status: "Open" }],
    feedback: [
      { by: 2, text: "UI looks amazing", stars: 5 },
      { by: 1, text: "Modern and clean", stars: 4 },
    ],
  },
];

export const members = [
  {
    id: 1,
    name: "Vansh Sharma",
    role: "Club President",
    img: "https://i.pravatar.cc/400?img=5",
    birthday: "12 Jan 2005",
    year: "3rd Year",
    course: "B.Tech",
    branch: "Computer Science",
    roll: "2215001234",

    attendance: {
      daily: [
        { date: "2025-01-05", present: true },
        { date: "2025-01-06", present: true },
      ],
      events: [
        { eventId: 101, present: true },
        { eventId: 102, present: false },
      ],
    },

    projects: [
      {
        projectId: 201,
        name: "Club Website Revamp",
        description: "Updating UI/UX and backend.",
        status: "In Progress",
        deadline: "2025-02-10",
        bugs: [
          { bugId: 1, title: "Navbar overlap", status: "Open" },
          { bugId: 2, title: "Login redirect issue", status: "Resolved" },
        ],
        feedback: [
          { by: "Admin", text: "Excellent leadership", stars: 5 },
          { by: "Tech Lead", text: "Coordinating very well", stars: 4 },
        ],
      },
    ],

    events: [
      {
        eventId: 101,
        name: "Hackathon 2025",
        role: "Host",
        responsibility: "Opening and management",
        attended: true,
      },
      {
        eventId: 102,
        name: "Tech Seminar",
        role: "Coordinator",
        responsibility: "Stage control",
        attended: false,
      },
    ],

    performance: {
      rating: 4.8,
      badges: ["Best Leader", "Top Contributor"],
      history: [
        { year: 2024, rating: 4.6, feedback: "Outstanding leadership" },
      ],
    },

    announcementsRead: [1, 2, 4],
    points: 520,
    leaderboardRank: 1,
  },

  {
    id: 2,
    name: "Nikhil Chauhan",
    role: "Tech Lead",
    img: "https://i.pravatar.cc/400?img=11",
    birthday: "05 Oct 2004",
    year: "3rd Year",
    course: "B.Tech",
    branch: "IT",
    roll: "2215001892",

    attendance: {
      daily: [
        { date: "2025-01-05", present: true },
        { date: "2025-01-06", present: false },
      ],
      events: [{ eventId: 101, present: true }],
    },

    projects: [
      {
        projectId: 202,
        name: "Droid Portal Backend",
        description: "Building API authentication and database models.",
        status: "Completed",
        deadline: "2025-01-10",
        bugs: [{ bugId: 1, title: "Token refresh issue", status: "Resolved" }],
        feedback: [{ by: "Admin", text: "Great backend work!", stars: 5 }],
      },
    ],

    events: [
      {
        eventId: 101,
        name: "Hackathon 2025",
        role: "Developer",
        responsibility: "Managing submissions",
        attended: true,
      },
    ],

    performance: {
      rating: 4.5,
      badges: ["Backend Wizard", "Bug Hunter"],
      history: [{ year: 2024, rating: 4.3, feedback: "Strong tech skills" }],
    },

    announcementsRead: [1, 3],
    points: 450,
    leaderboardRank: 3,
  },

  {
    id: 3,
    name: "Priya Singh",
    role: "Design Head",
    img: "https://i.pravatar.cc/400?img=32",
    birthday: "22 May 2005",
    year: "2nd Year",
    course: "B.Design",
    branch: "UI/UX",
    roll: "2315001021",

    attendance: {
      daily: [
        { date: "2025-01-05", present: true },
        { date: "2025-01-06", present: true },
      ],
      events: [{ eventId: 102, present: true }],
    },

    projects: [
      {
        projectId: 203,
        name: "Droid App UI",
        description: "Designing entire club portal UI/UX.",
        status: "In Progress",
        deadline: "2025-02-20",
        bugs: [{ bugId: 1, title: "Misaligned card", status: "Open" }],
        feedback: [
          { by: "Tech Lead", text: "UI looks amazing", stars: 5 },
          { by: "Admin", text: "Modern and clean", stars: 4 },
        ],
      },
    ],

    events: [
      {
        eventId: 102,
        name: "Tech Seminar",
        role: "Designer",
        responsibility: "Poster designing",
        attended: true,
      },
    ],

    performance: {
      rating: 4.6,
      badges: ["Creative Mind", "Design Expert"],
      history: [{ year: 2024, rating: 4.4, feedback: "Strong design ability" }],
    },

    announcementsRead: [2],
    points: 410,
    leaderboardRank: 4,
  },

  {
    id: 4,
    name: "Arjun Verma",
    role: "Event Coordinator",
    img: "https://i.pravatar.cc/400?img=67",
    birthday: "14 Mar 2004",
    year: "3rd Year",
    course: "BBA",
    branch: "Marketing",
    roll: "2216002891",

    attendance: {
      daily: [
        { date: "2025-01-05", present: false },
        { date: "2025-01-06", present: true },
      ],
      events: [{ eventId: 101, present: true }],
    },

    projects: [
      {
        projectId: 204,
        name: "Event Automation System",
        description: "Automating event tasks and communication.",
        status: "In Progress",
        deadline: "2025-03-15",
        bugs: [],
        feedback: [
          { by: "Admin", text: "Good coordination", stars: 4 },
        ],
      },
    ],

    events: [
      {
        eventId: 101,
        name: "Hackathon 2025",
        role: "Coordinator",
        responsibility: "Managing volunteers",
        attended: true,
      },
    ],

    performance: {
      rating: 4.2,
      badges: ["Team Player"],
      history: [{ year: 2024, rating: 4.0, feedback: "Responsible member" }],
    },

    announcementsRead: [1, 4],
    points: 360,
    leaderboardRank: 5,
  },

  {
    id: 5,
    name: "Sara Malik",
    role: "Content Lead",
    img: "https://i.pravatar.cc/400?img=47",
    birthday: "08 Aug 2005",
    year: "2nd Year",
    course: "BA",
    branch: "Journalism",
    roll: "2316002191",

    attendance: {
      daily: [
        { date: "2025-01-05", present: true },
        { date: "2025-01-06", present: false },
      ],
      events: [],
    },

    projects: [
      {
        projectId: 205,
        name: "Blog Content System",
        description: "Writing content for club website and social media.",
        status: "In Progress",
        deadline: "2025-02-28",
        bugs: [],
        feedback: [{ by: "Admin", text: "Content quality is great!", stars: 5 }],
      },
    ],

    events: [],

    performance: {
      rating: 4.1,
      badges: ["Creative Writer"],
      history: [{ year: 2024, rating: 3.9, feedback: "Good writing" }],
    },

    announcementsRead: [3],
    points: 330,
    leaderboardRank: 6,
  },

  {
    id: 6,
    name: "Rohit Mehra",
    role: "Developer",
    img: "https://imgs.search.brave.com/yAST8VvX07TXwq2Tr4o0cHbWTdm4Tzh3-Mx42SEGoJo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudG9paW1nLmNv/bS90aHVtYi85NTA1/NjE3MS5qcGc_aW1n/c2l6ZT0yMzQ1NiZw/aG90b2lkPTk1MDU2/MTcxJndpZHRoPTYw/MCZyZXNpemVtb2Rl/PTQ",
    birthday: "29 Dec 2004",
    year: "3rd Year",
    course: "B.Tech",
    branch: "CSE",
    roll: "2215002211",

    attendance: {
      daily: [
        { date: "2025-01-05", present: false },
        { date: "2025-01-06", present: true },
      ],
      events: [],
    },

    projects: [
      {
        projectId: 206,
        name: "Bug Tracking System",
        description: "Creating a tracking system for internal bugs.",
        status: "In Progress",
        deadline: "2025-03-30",
        bugs: [
          { bugId: 1, title: "API mismatch", status: "Open" },
        ],
        feedback: [{ by: "Tech Lead", text: "Promising developer", stars: 4 }],
      },
    ],

    events: [],

    performance: {
      rating: 4.0,
      badges: ["Fast Learner"],
      history: [{ year: 2024, rating: 3.8, feedback: "Improving well" }],
    },

    announcementsRead: [],
    points: 300,
    leaderboardRank: 7,
  },
];

const departments: string[] = [
    "Frontend",
    "Backend",
    "Devops",
    "Cybersecurity",
    "Designers",
    "Marketers",
    "Customercare",
    "Sales",
    "Humanresource",
    "Network engineers",
    "Hardware maintanance"
]


const employees = [
    {
        id:1,
        name:"Muhammad affan",
        email:"example1@gmail.com",
        department:departments[3],
    },
    {
        id:2,
        name:"Rizwan khan",
        email:"example2@gmail.com",
        department:departments[2]
    },
    {
        id:3,
        name:"Ali",
        email:"example3@gmail.com",
        department:departments[4]
    },
    {
        id:4,
        name:"Iqbal",
        email:"example4@gmail.com",
        department:departments[5]
    },
]

const tasks = [
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
    assignedTo: employees[0].id
  },
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
    assignedTo: employees[1].id
  },
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
    assignedTo: employees[2].id
  },
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
    assignedTo: employees[3].id
  },

];

const industryTypes = [
  "IT",
  "Education",
  "Finance",
  "Health care",
  "Other"
]

export {
    departments,
    employees,
    tasks,
    industryTypes
}
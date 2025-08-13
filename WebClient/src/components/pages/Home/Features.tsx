import React from "react";
import { Shield, Users , ClipboardList , Lock, ChartNoAxesCombined } from "lucide-react";

const features = [
  {
    title: "Role-Based Dashboards",
    description: "Separate dashboards for Managers and Employees to ensure clean and efficient user experiences.",
    icon: <Shield className="text-3xl text-blue-500" />,
  },
  {
    title: "Authentication System",
    description: "Secure login system with encrypted credentials and protected routes.",
    icon: <Lock className="text-3xl text-green-500" />,
  },
  {
    title: "Task Management",
    description: "Assign tasks to employees, track progress, and manage deadlines with ease.",
    icon: <ClipboardList className="text-3xl text-purple-500" />,
  },
  {
    title: "User Management",
    description: "Managers can add, update, and remove employees within the organization.",
    icon: <Users className="text-3xl text-orange-500" />,
  },
  {
    title: "Analytics & Reporting",
    description: "Get insights into performance and task completion through visual dashboards",
    icon: <ChartNoAxesCombined className="text-3xl text-red-500" />,
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Features</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore the powerful features of our Employee Management System designed to simplify and streamline your workflow.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;

"use client";
import { useState } from "react";
import {Link} from "react-router-dom";
import AssignmentSharpIcon from '@mui/icons-material/AssignmentSharp';
import CircleNotificationsSharpIcon from '@mui/icons-material/CircleNotificationsSharp';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';

const menuItems = [
  { href: "/dashboard", label: "Dashboard" , icon:<GridViewSharpIcon className="group-hover:text-white"/> },
  { href: "/dashboard/tasks", label: "Tasks" , icon:<AssignmentSharpIcon className="group-hover:text-white"/> },
  { href: "/dashboard/notifications", label: "Notifications" , icon: <CircleNotificationsSharpIcon className="group-hover:text-white"/>},
];

const DashboardSidebar = () => {
//   /* _____ router instance ... */
//   const router = useRouter();

//   /* _____ State for toogling sidebar... */
  const [navOpen, setNavOpen] = useState(false);

//   /* onclick Event : attemp GET request on logout api and redirect the user to landing page ... */
  const handleLogout = async () => {
    console.log("logout");
  }

  return (
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <aside className={`fixed z-20 top-0 left-0 h-full bg-gray-900 text-white w-64 p-6 transform transition-transform duration-300 ease-in-out ${navOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <nav className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold mb-8">Profile</h2>
            <div className="flex flex-col gap-4">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.href}
                  className="group hover:text-blue-500 transition-all duration-200 w-full ease-in-out cursor-pointer py-2 px-3 rounded-md flex flex-row flex-nowrap justify-start items-center gap-[6px]"
                >
                  {item.icon} <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <button
            className="w-full text-left hover:text-white transition-all duration-150 ease-in-out cursor-pointer hover:bg-[var(--faun-light)] py-2 px-3 rounded-md"
            aria-label="Logout"
            onClick={handleLogout}
          >
            Logout &nbsp; <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </nav>
      </aside>

      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-30 text-white bg-gray-900 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => setNavOpen(prev => !prev)}
        aria-label={navOpen ? "Close menu" : "Open menu"}
      >
        {navOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25H12" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default DashboardSidebar;
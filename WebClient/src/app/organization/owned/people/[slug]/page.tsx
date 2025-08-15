"use client";

/* Custom components ... */
import { OwnedOrganizationSidebar } from "@/components/layout";
import Image from "next/image";

/* Hooks ... */
import { useParams } from "next/navigation";

/* utility ... */
import convertToTitleCase from "@/lib/Convert";

/* Icons ... */
import { Building } from "lucide-react";

/* Store & types ... */
import { useOwnedOrganization } from "@/hooks";

export const description = "An area chart with gradient fill";

const ProfileDetails = () => {
  const { slug } = useParams();
  const { allUsers } = useOwnedOrganization();

  const requiredUser = allUsers.find((user) => user.id === slug);

  if (requiredUser) {
    return (
      <main className="flex h-screen bg-white">
        <OwnedOrganizationSidebar />
        <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
          <div className="rounded-full mx-auto w-[100px] h-[100px] overflow-hidden">
            <Image
              src="/images/profile.jpg"
              alt={requiredUser.name}
              width={90}
              height={90}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-center md:text-3xl sm:text-2xl max-sm:text-2xl font-bold text-gray-800 mb-6">
            {convertToTitleCase(requiredUser.name)}
          </h1>
          <h2 className="text-[16px] text-gray-400 text-center">
            {requiredUser.email}
          </h2>
          <br />
          <h2 className="md:text-2xl max-sm:text-xl font-bold text-gray-800 mb-6 px-[10px]">
            Details
          </h2>
          <div className="flex flex-row items-center gap-[10px] p-[10px]">
            <Building /> <span>Example department</span>
          </div>
          <h2 className="text-md font-bold text-gray-800 my-3 px-[10px]">
            Activity
          </h2>
          <ul>
            <li className="p-[10px]">Completed 3 out of 4 tasks this month</li>
            <li className="p-[10px]">3 Completed lately</li>
            <li className="p-[10px]">1 tasks overdue</li>
          </ul>
        </section>
      </main>
    );
  } else {
    return (
      <main className="flex h-screen bg-white">
        <OwnedOrganizationSidebar />
        <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Loading ...</h1>
        </section>
      </main>
    );
  }
};

export default ProfileDetails;

// "use client";

// /* Custom components ... */
// import { DashboardSidebar } from "@/components/layout"
// import Image from "next/image";

// /* Hooks ... */
// import { useParams } from "next/navigation";

// /* utility ... */
// import convertToTitleCase from "@/lib/Convert";

// /* Icons ... */
// import { Building} from "lucide-react";
// import { useDashboard } from "@/stores/dashboard";
// import { OrganizationsData, Profile } from "@/@types/modeltypes";
// import { useEffect, useState } from "react";

// export const description = "An area chart with gradient fill"

// const ProfileDetails = () => {
//     const { slug } = useParams();
//     const {selectedOrganization} = useDashboard();
//     const currentOrg = selectedOrganization as OrganizationsData;
//     console.log(currentOrg);

//     const [allUsers, setallUsers] = useState<Profile[]>([]);

//     useEffect(() => {
//     Object.keys(currentOrg.users).forEach((key) => {
//         setallUsers([...allUsers, ...currentOrg.users[key]])
//     });
//     console.log(allUsers);

//     },[currentOrg.users]);
//     // const requiredUser = allUsers.find((user) => user.id === slug);

//         // const { users, tasks } = useOrganizationDashboard();
//     // const requiredUser = users.find((user) => user.id === slug);
//     // const userTasks = tasks.filter((task) => task.userId === slug);

//     // const now = new Date();
//     // const currentMonth = now.getMonth();
//     // const currentYear = now.getFullYear();

//     // const tasksThisMonth = userTasks.filter((task) => {
//     //     const assignedDate = new Date(task.assignedOn); // safely parse string/date
//     //     return (
//     //         assignedDate.getMonth() === currentMonth &&
//     //         assignedDate.getFullYear() === currentYear
//     //     );
//     // });

//     // const completedTasks = tasksThisMonth.filter((task) => task.completed);
//     // const lateTasks = tasksThisMonth.filter((task) => task.completed && task.completedOn && task.completedOn > task.dueDate);
//     // const overDueTasks = tasksThisMonth.filter((task) => !task.completed && now > new Date(task.dueDate));

//     // console.log("Line 64 : ______ Total tasks :");
//     // console.table(userTasks);
//     // console.log("Line 64 : ______ Completed tasks :");
//     // console.table(completedTasks)
//     // console.log("Line 64 : ______ Tasks this month :");
//     // console.table(tasksThisMonth);

//     if (true) {
//         return (
//             <main className="flex h-screen bg-white">
//                 <DashboardSidebar />
//                 <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
//                     <div className="rounded-full mx-auto w-[100px] h-[100px] overflow-hidden">
//                         <Image
//                             src="/images/profile.jpg"
//                             alt={"example user"}
//                             width={90}
//                             height={90}
//                             className="object-cover w-full h-full"
//                         />
//                     </div>
//                     <h1 className="text-center md:text-3xl sm:text-2xl max-sm:text-2xl font-bold text-gray-800 mb-6">{"dmfdhfjd"}</h1>
//                     <h2 className="text-[16px] text-gray-400 text-center">{"exdjfjsdkfjsdkfds"}</h2>
//                     <br />
//                     <h2 className="md:text-2xl max-sm:text-xl font-bold text-gray-800 mb-6 px-[10px]">Details</h2>
//                     <div className="flex flex-row items-center gap-[10px] p-[10px]">
//                         <Building /> <span>Example departent</span>
//                     </div>
//                     <h2 className="text-md font-bold text-gray-800 my-3 px-[10px]">Activity</h2>
//                     <ul>
//                         <li className="p-[10px]">Completed 3 out of 4 tasks this month</li>
//                         <li className="p-[10px]">3 Completed lately</li>
//                         <li className="p-[10px]">1 tasks overdue</li>
//                     </ul>
//                 </section>
//             </main>
//         )
//     } else {
//         return (
//             <main className="flex h-screen bg-white">
//                 <DashboardSidebar/>
//                 <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-6">No details found for this employee ...</h1>
//                 </section>
//             </main>
//         )
//     }
// }

// export default ProfileDetails

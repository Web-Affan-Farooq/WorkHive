"use client";
import { ManagementSidebar } from "@/components/layout"
import DomainIcon from '@mui/icons-material/Domain';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useParams } from "next/navigation";
import { useOrganizationDashboard } from "@/stores/organization";

const ProfileDetails =  () => {
    const {slug} = useParams();
    const {users} = useOrganizationDashboard();    
    const requiredUser = users.find((user) => user.id === slug);

    if (requiredUser) {
        return (
            <main className="flex h-screen bg-white">
                <ManagementSidebar />
                <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                        <div className="rounded-full mx-auto w-[100px] h-[100px] overflow-hidden">
                            <img
                                src="/images/profile.jpg"
                                alt={requiredUser.name}
                                width={90}
                                height={90}
                                className="object-cover w-full h-full"
                            />
                        </div>                   
                        <h1 className="text-center md:text-3xl sm:text-2xl max-sm:text-2xl font-bold text-gray-800 mb-6">{requiredUser.name}</h1>
                        <h2 className="text-[16px] text-gray-400 text-center">{requiredUser.email}</h2>
                        <br />
                                                <h2 className="md:text-2xl max-sm:text-xl font-bold text-gray-800 mb-6 px-[10px]">Details</h2>
                        <div className="flex flex-row items-center gap-[10px] p-[10px]">
                        <DomainIcon/> <span>Example departent</span>
                        </div>
                        <div className="flex flex-row items-center gap-[10px] p-[10px]">
                        <AssignmentTurnedInIcon/><span>Completed 3 out of 5 tasks this month</span>
                        </div>
                </section>
            </main>
        )
    } else {
        return (
            <main className="flex h-screen bg-white">
                <ManagementSidebar />
                <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">No details found for this employee ...</h1>
                </section>
            </main>
        )
    }
}

export default ProfileDetails
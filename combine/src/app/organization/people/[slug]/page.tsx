import { ManagementSidebar } from "@/components/layout"
import DomainIcon from '@mui/icons-material/Domain';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {prisma} from "@/lib/prisma";

const ProfileDetails = async ({params}:{params:Promise<{slug:string}>}) => {
    const { slug } = await params;
    const employeeDetails = await prisma.workers.findUnique(
        {
            where: {
                id:slug
            }
        }
    );
    const organizationEmployee = await prisma.organization.findUnique(
        {
            where: {
                id:employeeDetails?.id
            }
        }
    )

    if (employeeDetails) {
        return (
            <main className="flex h-screen bg-white">
                <ManagementSidebar />
                <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                        <div className="rounded-full mx-auto w-[100px] h-[100px] overflow-hidden">
                            <img
                                src="/images/profile.jpeg"
                                alt={employeeDetails.name}
                                width={90}
                                height={90}
                                className="object-cover w-full h-full"
                            />
                        </div>                   
                        <h1 className="text-center md:text-3xl max-sm:text-2xl font-bold text-gray-800 mb-6">{employeeDetails.name}</h1>
                        <h2 className="text-[16px] text-gray-400 text-center">{employeeDetails.email}</h2>
                        <br />
                                                <h2 className="md:text-2xl max-sm:text-xl font-bold text-gray-800 mb-6 px-[10px]">Details</h2>
                        <div className="flex flex-row items-center gap-[10px] p-[10px]">
                        <DomainIcon/> <span>{organizationEmployee?.name}</span>
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
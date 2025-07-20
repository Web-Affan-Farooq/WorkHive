import { ManagementSidebar } from "@/components/layout"
import { employees } from "@/constants/constants"
import { useParams } from "react-router-dom";
import DomainIcon from '@mui/icons-material/Domain';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const ProfileDetails = () => {
    const { id } = useParams();
    const employeeDetails = employees.find((em) => em.id === Number(id));

    if (employeeDetails) {
        return (
            <main className="flex h-screen bg-white">
                <ManagementSidebar />
                <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                        <div className="rounded-full mx-auto w-[100px] h-[100px] overflow-hidden">
                            <img
                                src="https://cdn.dribbble.com/userupload/13475147/file/original-0b9c0607f2db3125f46f25014391394d.png?resize=1024x640&vertical=center"
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
                        <DomainIcon/> <span>{employeeDetails.department}</span>
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
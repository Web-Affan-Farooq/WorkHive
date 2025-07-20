import { ManagementSidebar} from "../../layout";
import { employees } from "@/constants/constants";
import { Link } from "react-router-dom";

interface Employee {
  department:string;
  email:string;
  id:number;
  name:string;
}

const Card = ({employeeData}:{employeeData:Employee}) => {
    return (
        <div className="flex items-center gap-4 md:px-[30px] py-2 w-full">
            {/* Profile Image */}
            <div className="flex-shrink-0">
                <div className="rounded-lg border-2 border-gray-500 w-[45px] h-[45px] overflow-hidden">
                    <img
                        src="https://cdn.dribbble.com/userupload/13475147/file/original-0b9c0607f2db3125f46f25014391394d.png?resize=1024x640&vertical=center"
                        alt={employeeData.name}
                        width={90}
                        height={90}
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col justify-center items-start min-w-0">
                {/* <div className="relative flex flex-row flex-nowrap justify-center items-center gap-[10px]">
                <h4 className="text-white text-md font-bold leading-tight truncate">Mdfu ifuiods ff dsfidsopfi ad Affan</h4>
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                </div> */}
                <div className="relative flex flex-row flex-nowrap justify-center items-center gap-[10px] min-w-0 w-full">
                    <h4 className="text-[15px] font-bold leading-tight flex-grow">
                        {employeeData.name}
                    </h4>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                </div>

                <p className="text-sm text-pink-text break-words">{employeeData.email}</p>
            </div>

        </div>
    );
};

const Tasks = () => {
    
  return (
    <main className="flex h-screen bg-white">
      <ManagementSidebar />
      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">People</h1>
        <div>
          {
            employees.map((employee , idx) => (
              <Link to={`/management/people/${employee.id}`} key={idx}>
              <Card employeeData={employee}/>
              </Link>
            ) )
          }
        </div>
      </section>
    </main>
  );
};

export default Tasks;
"use client";
import { OwnedOrganizationData } from "@/@types/modeltypes";
import { OwnedOrganizationSidebar } from "@/components/layout";
import { useDashboard } from "@/stores/dashboard";
import { useParams } from "next/navigation";

const DepartmentDetailsPage = () => {
  const { id } = useParams();
  const { currentOrganization } = useDashboard();
  const departments = (currentOrganization as OwnedOrganizationData)
    .departments;
  const requiredDepartment = departments.find((dept) => dept.id === id)!;
  const staff = (currentOrganization as OwnedOrganizationData).users;

  const users = staff[requiredDepartment.id];

  if (requiredDepartment) {
    return (
      <main className="relative flex h-screen bg-white">
        <OwnedOrganizationSidebar />
        <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
          <h1 className="font-bold text-[20px] text-indigo-600">
            {requiredDepartment.name}
          </h1>
          <br />
          <h1 className="font-bold text-[16px]">Users :</h1>
          <br />
          <div className="flex flex-col gap-[10px]">
            {users.length <= 0 ? (
              <p className="text-gray-400 text-sm">
                No user in this department found ...
              </p>
            ) : (
              users.map((employee, idx) => (
                <div className="border border-black p-2 rounded-md" key={idx}>
                  <h2 className="text-sm font-bold">{employee.name}</h2>
                  <p className="text-gray-400 text-sm">{employee.email}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    );
  }
};
export default DepartmentDetailsPage;

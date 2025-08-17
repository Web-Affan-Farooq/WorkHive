import { JoinedOrganizationSidebar } from "@/components/layout";
import LeaveOrganization from "./LeaveOrganization";

const SettingsPage = () => {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <JoinedOrganizationSidebar />

      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7 space-y-10">
        <h1 className="text-[24px] font-bold text-gray-800">Settings</h1>
        <LeaveOrganization />
      </section>
    </main>
  );
};

export default SettingsPage;

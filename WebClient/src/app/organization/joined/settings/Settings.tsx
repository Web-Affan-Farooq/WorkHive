import { JoinedOrganizationSidebar } from "@/components/layout";
import LeaveOrganization from "./LeaveOrganization";
const SettingsPage = () => {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <JoinedOrganizationSidebar />

      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7 space-y-10">
        <h1 className="text-[24px] font-bold text-gray-800">Settings</h1>

        {/* Profile Settings */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Update profile
          </h2>
          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger className="bg-black cursor-pointer text-white px-4 py-2 rounded hover:bg-gray-900">
                Update Profile
              </AlertDialogTrigger>
              <AlertDialogContent>
                <form onSubmit={handleSubmit(handleUpdateProfile)}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Enter updated info
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <input
                    type="text"
                    className="w-full border rounded px-4 py-2 mb-3"
                    placeholder="Your name"
                    {...register("newName")}
                  />
                  {errors.newName && (
                    <p className="text-red-500 text-sm">
                      {errors.newName.message}
                    </p>
                  )}

                  <input
                    type="email"
                    className="w-full border rounded px-4 py-2 mb-3"
                    placeholder="Your email"
                    {...register("newEmail")}
                  />
                  {errors.newEmail && (
                    <p className="text-red-500 text-sm">
                      {errors.newEmail.message}
                    </p>
                  )}

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type={"submit"}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div> */}
        {/* Password Settings */}
        <LeaveOrganization />
      </section>
    </main>
  );
};

export default SettingsPage;

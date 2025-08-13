import { DashboardSidebar } from "../../layout"

const Dashboard = () => {

  return (
    <main className="flex h-screen">
      <DashboardSidebar />
      <section className="flex-1 bg-white min-h-screen">
          <h1 className="text-[23px] font-bold text-gray-800 p-10 max-sm:px-5 max-sm:py-7">Dashboard</h1>
        progress
      </section>
    </main>
  )
}

export default Dashboard

"use client";
import { useOrganizationDashboard } from "@/stores/organization";
import { ManagementSidebar } from "@/components/layout"
// import { useState } from "react";
// import { useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// import { TrendingUp } from "lucide-react"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

export const description = "An area chart with gradient fill"

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--chart-1)",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "var(--chart-2)",
//   },
// } satisfies ChartConfig


const Management = () => {
  /* 1. ____ Global state storing data for implementation of one time fetch  ... */
  const { departments, tasks ,users} = useOrganizationDashboard();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const tasksThisMonth = tasks.filter((task) => {
        const assignedDate = new Date(task.assignedOn); // safely parse string/date
        return (
            assignedDate.getMonth() === currentMonth &&
            assignedDate.getFullYear() === currentYear
        );
    });

    const tasksCompletedThisMonth = tasksThisMonth.filter((task) => {
      return (
        task.completed && task.completedOn && new Date(task.completedOn) < new Date(task.dueDate)
      )
    });
    const employees = users.filter((user) => !user.isManager);

  /* 2. _____ Fetch all data on first render to reduce server request rate ...  */
  // useEffect(() => {
  //   const organizationId = window.localStorage.getItem("org-ID");

  //   const getData = async () => {
  //     const employeesFetched = await axios.get("/api/employees");
  //     const tasksFetched = await axios.get(`/api/tasks?orgId=${organizationId}`);
  //     const departmentsFetched = await axios.get("/api/departments");
  //     feedUsers(employeesFetched.data.employees);
  //     feedTasks(tasksFetched.data.tasks);
  //     feedDepartments(departmentsFetched.data.departments);
  //     console.log("organization.tsx :::: Line 15   departments : ", departmentsFetched.data.departments);
  //     console.log("organization.tsx :::: Line 15   Employees : ", employeesFetched.data.employees);
  //     console.log("organization.tsx :::: Line 15   Tasks : ", tasksFetched.data.tasks);
  //   };

  //   if (organizationId) {
  //     getData();
  //   } else {
  //     toast.error("organization id not found")
  //   }
  // }, [feedUsers, feedTasks, feedDepartments]);

  /* 3. _____ State storing selected department ... */
  // const [selectedDepartment, setselectedDepartment] = useState(departments[0]);

  return (
    <main className="flex h-screen">
      <ManagementSidebar />
      <section className="flex-1 bg-white h-screen overflow-y-auto">
        {/* main heading */}
        <h1 className="text-[23px] font-bold text-gray-800 pt-10 pb-5 px-7 max-sm:px-5 max-sm:py-7">Management</h1>
        {/*  Flash cards  */}
        <div className="flex flex-row flex-nowrap gap-[10px]">
          <div className="flex flex-row flex-wrap gap-5 px-7 pb-5">
            {/* Total Orders Card */}
            <div className="bg-blue-600 rounded-2xl w-[160px] h-[80px] px-4 py-2 max-sm:w-[130px] max-sm:h-[65px]">
              <span className="text-sm text-gray-200">Employees</span>
              <p className="text-3xl font-bold text-white max-sm:text-xl">{employees.length}</p>
            </div>
            <div className="bg-green-500 rounded-2xl w-[160px] h-[80px] px-4 py-2 max-sm:w-[130px] max-sm:h-[65px]">
              <span className="text-sm text-gray-200">Tasks assigned</span>
              <p className="text-3xl font-bold text-white max-sm:text-xl">{tasksThisMonth.length}</p>
            </div>
            <div className="bg-pink-600 rounded-2xl w-[160px] h-[80px] px-4 py-2 max-sm:w-[130px] max-sm:h-[65px]">
              <span className="text-sm text-gray-200">Completed</span>
              <p className="text-3xl font-bold text-white max-sm:text-xl">{tasksCompletedThisMonth.length}</p>
            </div>
          </div>
        </div>
        {/* departments */}
        <h2 className="text-[20px] font-bold text-gray-800 pt-7 pb-5 px-7 max-sm:px-5 max-sm:py-7">Departments</h2>
        <div className="px-7 flex flex-row flex-nowrap max-sm:flex-row gap-[10px]">
          {
            departments.map((department, idx) => (
              <div className="relative px-5 py-2 rounded-xl bg-green-400 text-white font-semibold " key={idx}>{department.name} <span className="absolute w-6 h-6 text-center right-0 top-0 bg-pink-600 rounded-full text-white">3</span></div>
            ))
          }
        </div>
        <br /><br /><br />
        {/* <div className="max-sm:p-0 px-7">
          <Card className="h-auto w-full">
            <CardHeader>
              <CardTitle>Activity chart</CardTitle>
              <CardDescription>
                Showing progress of the department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    January - June 2024
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div> */}


      </section>
    </main>
  )
}

export default Management

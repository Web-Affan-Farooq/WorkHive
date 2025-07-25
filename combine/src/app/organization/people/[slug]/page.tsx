"use client";

/* Custom components ... */
import { ManagementSidebar } from "@/components/layout"
import Image from "next/image";

/* Hooks ... */
import { useParams } from "next/navigation";
import { useOrganizationDashboard } from "@/stores/organization";

/* utility ... */
import convertToTitleCase from "@/lib/Convert";

/* Types ... */
import { Task } from "@/@types/Task";

/* Icons ... */
import { Building, ClipboardList } from "lucide-react";

/* Shadcn ui components ... */
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,

} from "@/components/ui/chart"


/*  Rechart components ... */
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts"

export const description = "An area chart with gradient fill"


const chartConfig = {
    month: {
        label: "Month",
        color: "var(--chart-1)",
    },
    tasks: {
        label: "Tasks",
        color: "var(--chart-2)",
    },
    completed: {
        label: 'Completed',
        color: "var(--chart-3)"
    }
} satisfies ChartConfig


const ProfileDetails = () => {
    const { slug } = useParams();
    const { users, tasks } = useOrganizationDashboard();
    const requiredUser = users.find((user) => user.id === slug);
    const userTasks = tasks.filter((task) => task.userId === slug);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const tasksThisMonth = userTasks.filter((task) => {
        const assignedDate = new Date(task.assignedOn); // safely parse string/date
        return (
            assignedDate.getMonth() === currentMonth &&
            assignedDate.getFullYear() === currentYear
        );
    });

    const completedTasks = tasksThisMonth.filter((task) => task.completed);

    const tasksByMonth: { [key: string]: Task[] } = {};

    tasks.forEach((task) => {
        const date = new Date(task.assignedOn);
        if (date.getFullYear() === currentYear) {
            const month = date.toLocaleString('default', { month: 'long' }); // e.g., "January"
            if (!tasksByMonth[month]) {
                tasksByMonth[month] = [];
            }
            tasksByMonth[month].push(task);
        }
    });

    const chartData: { month: string; tasks: number, completed: number }[] = []

    for (const item in tasksByMonth) {
        chartData.push(
            {
                month: item,
                tasks: tasksByMonth[item].length,
                completed: tasksByMonth[item].filter((task) => (task.completed)).length,
            }
        )
    }

    console.log(chartData);


    if (requiredUser) {
        return (
            <main className="flex h-screen bg-white">
                <ManagementSidebar />
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
                    <h1 className="text-center md:text-3xl sm:text-2xl max-sm:text-2xl font-bold text-gray-800 mb-6">{convertToTitleCase(requiredUser.name)}</h1>
                    <h2 className="text-[16px] text-gray-400 text-center">{requiredUser.email}</h2>
                    <br />
                    <h2 className="md:text-2xl max-sm:text-xl font-bold text-gray-800 mb-6 px-[10px]">Details</h2>
                    <div className="flex flex-row items-center gap-[10px] p-[10px]">
                        <Building /> <span>Example departent</span>
                    </div>
                    <div className="flex flex-row items-center gap-[10px] p-[10px]">
                        <ClipboardList /><span>Completed {completedTasks.length} out of {tasksThisMonth.length} tasks this month</span>
                    </div>

                    <div className="max-sm:p-0 px-7">
                        <Card className="b">
                            <CardHeader>
                                <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
                                <CardDescription>January - June 2024</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig}>
                                    <BarChart accessibilityLayer data={chartData}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                        <ChartLegend content={<ChartLegendContent />} />
                                        <Bar
                                            dataKey="tasks"
                                            stackId="a"
                                            fill="var(--chart-2)"
                                            radius={[0, 0, 4, 4]}
                                        />
                                        <Bar
                                            dataKey="completed"
                                            stackId="a"
                                            fill="var(--color-mobile)"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                            {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="text-muted-foreground leading-none">
                                    Showing total visitors for the last 6 months
                                </div>
                            </CardFooter> */}
                        </Card>

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

// "use client"

// import { TrendingUp } from "lucide-react"
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card"
// import {
//     ChartConfig,
//     ChartContainer,
//     ChartLegend,
//     ChartLegendContent,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart"


"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useJoinedOrganizationData from "./useJoinedOrganizationData";

export const description = "A stacked bar chart with a legend";

const chartConfig = {
  assigned: {
    label: "Assigned",
    color: "var(--chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  overdue: {
    label: "Overdue",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function JoinedOrganizationAnalytics() {
  const { lastSixMonthsData, startingMonth, currentMonth } =
    useJoinedOrganizationData();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task activity of last six months</CardTitle>
        <CardDescription>
          {startingMonth} - {currentMonth}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={lastSixMonthsData}>
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
              dataKey="assigned"
              stackId="a"
              fill="oklch(72.3% 0.219 149.579)"
              radius={[15, 15, 15, 15]}
            />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="oklch(52.5% 0.223 3.958)"
              radius={[15, 15, 15, 15]}
            />
            <Bar
              dataKey="overdue"
              stackId="a"
              fill="oklch(79.5% 0.184 86.047)"
              radius={[15, 15, 15, 15]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default JoinedOrganizationAnalytics;

// "use client";

// import { TrendingUp } from "lucide-react";
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import useJoinedOrganizationData from "./useJoinedOrganizationData";

// export const description = "An area chart with gradient fill";

// // const chartData = [
// //   { month: "January", desktop: 186, mobile: 80 },
// //   { month: "February", desktop: 305, mobile: 200 },
// //   { month: "March", desktop: 237, mobile: 120 },
// //   { month: "April", desktop: 73, mobile: 190 },
// //   { month: "May", desktop: 209, mobile: 130 },
// //   { month: "June", desktop: 214, mobile: 140 },
// // ];

// const chartConfig = {
//   assigned: {
//     label: "Assigned",
//     color: "var(--chart-1)",
//   },
//   completed: {
//     label: "Completed",
//     color: "var(--chart-2)",
//   },
//   overdue: {
//     label: "Overdue",
//     color: "var(--chart-3)",
//   },
// } satisfies ChartConfig;

// export function JoinedOrganizationAnalytics() {
//   const { lastSixMonthsData } = useJoinedOrganizationData();
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Area Chart - Gradient</CardTitle>
//         <CardDescription>Showing activity of last 6 months</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <AreaChart
//             accessibilityLayer
//             data={lastSixMonthsData}
//             margin={{
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
//             <defs>
//               <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-desktop)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-desktop)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//               <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="var(--color-mobile)"
//                   stopOpacity={0.1}
//                 />
//               </linearGradient>
//             </defs>
//             <Area
//               dataKey="assigned"
//               type="natural"
//               fill="url(#fillMobile)"
//               fillOpacity={0.4}
//               stroke="oklch(59.2% 0.249 0.584)"
//               stackId="a"
//             />
//             <Area
//               dataKey="completed"
//               type="natural"
//               fill="url(#fillDesktop)"
//               fillOpacity={0.4}
//               stroke="var(--color-desktop)"
//               stackId="a"
//             />
//             <Area
//               dataKey="overdue"
//               type="natural"
//               fill="oklch(59.2% 0.249 0.584)"
//               fillOpacity={0.4}
//               stroke="var(--color-desktop)"
//               stackId="a"
//             />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter>
//         <div className="flex w-full items-start gap-2 text-sm">
//           <div className="grid gap-2">
//             <div className="flex items-center gap-2 leading-none font-medium">
//               Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//             </div>
//             <div className="text-muted-foreground flex items-center gap-2 leading-none">
//               January - June 2024
//             </div>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// export default JoinedOrganizationAnalytics;

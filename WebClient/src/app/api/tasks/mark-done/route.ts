// import { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// interface Body {
//     id: string;
//     note: string;
//     completedOn: Date;
//     userId: string;
//     userName: string;
//     orgId: string;
//     status: "LATE" | "ON-TIME"
// }

// async function notifyManagers(orgId: string, notification: { title: string; message: string; type: "SUCCESS" | "FAILURE" }) {

//     const managers = await prisma.users.findMany({
//         where: {
//             organizationId: orgId,
//             isManager: true,
//         }
//     });

//     console.log("Line 24    GET     Organization managers  ...     :::: ", managers);

//     managers.forEach(async (manager) => {
//         await prisma.notification.create(
//             {
//                 data: {
//                     ...notification,
//                     read: false,
//                     userId: manager.id,
//                 }
//             }
//         )
//     })
//     console.log("Notificatoisn pushed successfully");
// }

// export const POST = async (req: NextRequest) => {
//     const body: Body = await req.json();
//     console.log("Line 17 GET  recieve body ::: ", body);

//     try {
//         const updatedTask = await prisma.task.update(
//             {
//                 where: {
//                     id: body.id,
//                 },
//                 data: {
//                     note: body.note,
//                     completed: true,
//                     completedOn: body.completedOn,
//                 }
//             }
//         ).then(() => console.log("Marked as done"))

//         if (body.status === "LATE") {
//             console.log("Line58 GET  Late submission ...     :::: ");

//             notifyManagers(body.orgId, {
//                 title: `New task completion`,
//                 message: `Late taks submission from ${body.userName}`,
//                 type: "SUCCESS",
//             });
//         }
//         else if (body.status === "ON-TIME") {
//             console.log("Line 17 GET  Submissions on time  ...     :::: ");

//             notifyManagers(body.orgId, {
//                 title: `New task completion`,
//                 message: `Task assigned to ${body.userName} hasbeen completed successfully`,
//                 type: "SUCCESS",
//             });
//         }

//         return NextResponse.json({
//             message: "Marked as done",
//             success: true,
//             task: updatedTask,
//         });

//     } catch (err) {
//         console.log(err);
//         return NextResponse.json({
//             message: "An error occured",
//             success: false,
//         })
//     }
// }

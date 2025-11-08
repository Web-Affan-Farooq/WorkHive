import DashboardDataAction from "@/actions/dashboard";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => {
    return NextResponse.json({
        data:DashboardDataAction()
    })
}
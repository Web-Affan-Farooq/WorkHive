"use client";
import Logger from "@/lib/logger";
import { useDashboard } from "@/stores/dashboard";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import toast from "react-hot-toast";
import { Notification } from "@/@types/Notification";

import {
  JoinedOrganizationData,
  OwnedOrganizationData,
} from "@/@types/modeltypes";

const logger = new Logger("/FetchDashboardData.tsx");
const FetchData = ({ children }: { children: ReactNode }) => {
  /* ____ Feeders ... */
  const router = useRouter();
  const {
    setInfo,
    feedOwnedOrganizations,
    feedJoinedOrganizations,
    setNotifications,
  } = useDashboard();

  /* ____ fetches data from specific dashboard route  ... */
  useEffect(() => {
    const getData = async () => {
      try {
        logger.log(
          19,
          "-----------------Running data fetches-----------------",
          ""
        );
        const response = await axios.get("/api/dashboard");
        const data: {
          name: string;
          email: string;
          plan: "FREE" | "PRO" | "TEAMS";
          ownedOrganizations: OwnedOrganizationData[];
          joinedOrganizations: JoinedOrganizationData[];
          notifications: Notification[];
        } = response.data.data;
        /* ____ Feed the fetched data into state for maintaining cache ... */
        setInfo({
          name: data.name,
          email: data.email,
          plan: data.plan,
        });
        feedOwnedOrganizations(data.ownedOrganizations);
        feedJoinedOrganizations(data.joinedOrganizations);
        setNotifications(data.notifications);
        console.log("owned organizations : ", data.ownedOrganizations);
        console.log("joined organizations : ", data.joinedOrganizations);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login");
        } else {
          console.log(err);
          toast.error("An error occured");
        }
      }
    };
    getData();
    const interval = setInterval(() => {
      getData();
    }, 600000); // 10 minutes

    return () => clearInterval(interval); // ✅ cleanup
  }, [
    feedOwnedOrganizations,
    feedJoinedOrganizations,
    setInfo,
    router,
    setNotifications,
  ]);

  return <>{children}</>;
};

export default FetchData;

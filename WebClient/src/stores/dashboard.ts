import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { OwnedOrganizationData } from "@/@types/modeltypes";
import { JoinedOrganizationData } from "@/@types/modeltypes";
import { Notification } from "@/@types/Notification";

interface Info {
  name: string;
  email: string;
  plan: "FREE" | "TEAMS" | "PRO" | "";
}

interface DashboardState {
  info: Info;
  setInfo: (info: Info) => void;

  joinedOrganizations: JoinedOrganizationData[];
  feedJoinedOrganizations: (list: JoinedOrganizationData[]) => void;

  ownedOrganizations: OwnedOrganizationData[];
  feedOwnedOrganizations: (list: OwnedOrganizationData[]) => void;

  // removeUser: (deptId: string, userId: string) => void;
  clearCache: () => void;
  notifications: Notification[];
  setNotifications: (list: Notification[]) => void;
  seenNotification: (notificationId: string) => void;
}

export const useDashboard = create<DashboardState>()(
  devtools(
    // 👈 wrap your store
    persist(
      (set) => ({
        info: { name: "", email: "", plan: "" },

        setInfo: (info: Info) =>
          set(
            () => ({
              info: { name: info.name, email: info.email, plan: info.plan },
            }),
            false,
            "dashboard/setInfo" // 👈 optional action name for DevTools
          ),

        joinedOrganizations: [],
        feedJoinedOrganizations: (list) =>
          set(
            () => ({ joinedOrganizations: list }),
            false,
            "dashboard/feedJoinedOrgs"
          ),

        ownedOrganizations: [],
        feedOwnedOrganizations: (list) =>
          set(
            () => ({ ownedOrganizations: list }),
            false,
            "dashboard/feedOwnedOrgs"
          ),

        clearCache: () =>
          set(
            () => ({
              info: { name: "", email: "", plan: "" },
              joinedOrganizations: [], // 👈 fixed (was "organizations" typo)
              ownedOrganizations: [],
            }),
            false,
            "dashboard/clearCache"
          ),
        notifications: [],
        setNotifications: (list) =>
          set(() => ({
            notifications: list,
          })),
        seenNotification: (notificationId) =>
          set((state) => ({
            notifications: state.notifications.map((not) => {
              if (not.id === notificationId) return { ...not, read: true };
              else return not;
            }),
          })),
      }),
      {
        name: "dashboard-data",
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { name: "DashboardStore" } // 👈 store name in Redux DevTools extension
  )
);

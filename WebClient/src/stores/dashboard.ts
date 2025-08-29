import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  OwnedOrganization,
  joinedOrganization,
  Notification,
} from "@/@types/types";

interface Info {
  name: string;
  email: string;
  plan: "FREE" | "TEAMS" | "PRO" | "";
}

interface DashboardState {
  info: Info;
  setInfo: (info: Info) => void;

  joinedOrganizations: joinedOrganization[];
  feedJoinedOrganizations: (list: joinedOrganization[]) => void;

  ownedOrganizations: OwnedOrganization[];
  feedOwnedOrganizations: (list: OwnedOrganization[]) => void;

  // removeUser: (deptId: string, userId: string) => void;
  clearCache: () => void;
  notifications: Notification[];
  setNotifications: (list: Notification[]) => void;
  seenNotification: (notificationId: string) => void;
}

export const useDashboard = create<DashboardState>()(
  persist(
    (set) => ({
      info: { name: "", email: "", plan: "" },

      setInfo: (info: Info) =>
        set(() => ({
          info: { name: info.name, email: info.email, plan: info.plan },
        })),

      joinedOrganizations: [],
      feedJoinedOrganizations: (list) =>
        set(() => ({ joinedOrganizations: list })),

      ownedOrganizations: [],
      feedOwnedOrganizations: (list) =>
        set(() => ({ ownedOrganizations: list })),

      clearCache: () =>
        set(() => ({
          info: { name: "", email: "", plan: "" },
          joinedOrganizations: [], // 👈 fixed (was "organizations" typo)
          ownedOrganizations: [],
        })),
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
  )
);

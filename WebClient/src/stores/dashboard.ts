import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OwnedOrganizationData, Profile } from "@/@types/modeltypes";
// import { Profile } from "@/@types/modeltypes";
import { JoinedOrganizationData } from "@/@types/modeltypes";

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
  /* eslint-disable-next-line   @typescript-eslint/no-empty-object-type */
  currentOrganization: OwnedOrganizationData | JoinedOrganizationData | null;

  setJoinedOrganization: (org: string) => void;
  setOwnedOrganization: (org: string) => void;

  feedOwnedOrganizations: (list: OwnedOrganizationData[]) => void;

  removeUser: (deptId: string, userId: string) => void;
  clearCache: () => void;
}

export const useDashboard = create<DashboardState>()(
  persist(
    (set) => ({
      info: {
        name: "",
        email: "",
        plan: "",
      },
      setInfo: (info: Info) =>
        set(() => ({
          info: {
            name: info.name,
            email: info.email,
            plan: info.plan,
          },
        })),

      joinedOrganizations: [],

      feedJoinedOrganizations: (list) =>
        set(() => ({
          joinedOrganizations: list,
        })),

      ownedOrganizations: [],
      currentOrganization: null,

      setJoinedOrganization: (id) =>
        set((state) => ({
          currentOrganization: state.joinedOrganizations.find(
            (org) => org.id === id
          )!,
        })),

      setOwnedOrganization: (id) =>
        set((state) => ({
          currentOrganization: state.ownedOrganizations.find(
            (org) => org.id === id
          )!,
        })),

      feedOwnedOrganizations: (list) =>
        set(() => ({
          ownedOrganizations: list,
        })),

      removeUser: (deptId, userId) =>
        set((state) => {
          const organization =
            state.currentOrganization as OwnedOrganizationData;

          return {
            currentOrganization: {
              ...organization,
              users: {
                ...organization.users,
                deptId: organization.users[deptId].filter(
                  (user) => user.id !== userId
                ),
              },
            },
          };
        }),

      clearCache: () =>
        set(() => ({
          info: {
            name: "",
            email: "",
            plan: "",
          },
          organizations: [],
        })),
    }),
    {
      name: "dashboard-data",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

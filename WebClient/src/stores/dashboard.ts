import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { OrganizationsData } from '@/@types/modeltypes';
// import { Profile } from "@/@types/modeltypes";

interface Info {
  name: string;
  email: string;
  plan: "FREE" | "TEAMS" | "PRO" | ""
}
interface DashboardState {
  info: Info;
  setInfo: (info: Info) => void;
  organizations: OrganizationsData[];
  /* eslint-disable-next-line   @typescript-eslint/no-empty-object-type */
  selectedOrganization: OrganizationsData | {};
  selectOrganization: (org: string) => void;
  feedOrganizations: (list: OrganizationsData[]) => void;
  removeUser: (deptId: string, userId: string) => void;
  clearCache: () => void;
}

export const useDashboard = create<DashboardState>()(
  persist(
    (set) => ({
      info: {
        name: '',
        email: "",
        plan: "",
      },
      setInfo: (info: Info) => set(() => ({
        info: {
          name: info.name,
          email: info.email,
          plan: info.plan
        }
      })),

      organizations: [],
      selectedOrganization: {},
      selectOrganization: (id) => set((state) => (
        {
          selectedOrganization: state.organizations.find((org) => org.id === id)!,
        }
      )),

      feedOrganizations: (list) => set(() => (
        {
          organizations: list
        }
      )),

      removeUser: (deptId, userId) => set((state) => {
        const organization = state.selectedOrganization as OrganizationsData;

        return {
          selectedOrganization: {
            ...organization,
            users: {
              ...organization.users,
              deptId: organization.users[deptId].filter((user) => user.id !== userId)
            }
          }
        }
      }),

      clearCache: () => set(() => (
        {
          info: {
            name: "",
            email: "",
            plan: '',
          },
          organizations: [],
        }
      ))

    })
    ,
    {
      name: 'dashboard-data',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
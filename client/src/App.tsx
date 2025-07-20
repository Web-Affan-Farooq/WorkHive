import { Routes, Route } from 'react-router-dom';
import { LoginPage, Dashboard, Management, DashboardNotifications, ManagementNotifications, DashboardTasks , ManagementTasks , ManagementPeople, ProfileDetails, OrganizationCreationForm} from './components/pages';

function App() {
  return (
    <Routes>
      <Route path={"/login/:id"} element={<LoginPage />} />
      <Route path={"/create-organization"} element={<OrganizationCreationForm />} />
      <Route path={"/dashboard"} element={<Dashboard />} />
      <Route path={"/management"} element={<Management />} />
      <Route path={"/dashboard/tasks"} element={<DashboardTasks />} />
      <Route path={"/management/tasks"} element={<ManagementTasks />} />
      {/* <Route path={"/management/tasks"} element={<NotificationTasks />} /> */}
      <Route path={"/dashboard/notifications"} element={<DashboardNotifications />} />
      <Route path={"/management/notifications"} element={<ManagementNotifications />} />
      <Route path={"/management/people"} element={<ManagementPeople />} />
      <Route path={"/management/people/:id"} element={<ProfileDetails />} />
    </Routes>
  )
}

export default App
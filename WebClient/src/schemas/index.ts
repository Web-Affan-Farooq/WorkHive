// ____ tables ...
export { comments } from "./tables/comment";
export { departments } from "./tables/departments";
export { notifications } from "./tables/notification";
export { organizations } from "./tables/organizations";
export { tasks } from "./tables/tasks";
export { users } from "./tables/users";

// ____ relations ...
export {
  commentsTaskRelation,
  taskCommentsRelation,
} from "./relations/comment-task";
export {
  taskRelationsWithOrganization,
  organizationRelationsWithTasks,
} from "./relations/task-organizations";
export {
  commentsRelationWithUser,
  userRelationWithComments,
} from "./relations/comment-user";
export {
  organizationRelationWithDepartments,
  departmentsRelationWithOrganization,
} from "./relations/organization-departments";
export {
  taskAssignees,
  userTaskJunction,
  userTasks,
  usersTasksRelation,
} from "./relations/tasks-users";
export {
  userDepartments,
  departmentUsers,
  userDepartmentsJunction,
  userDepartmentsRelation,
} from "./relations/user-departments";
export {
  userRelationWithNotifications,
  notificationsRelationWithUser,
} from "./relations/users-notification";
export {
  usersRelationWithOrganizations,
  organizationsRelationsWithUser,
} from "./relations/users-organization";

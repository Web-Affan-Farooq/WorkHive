import {Users} from "./Users";

export interface Organization {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  industryType: string;
  address: string;
  telephone: string;
  email: string;
  password: string;
  users: Users[];          // relation
  maximumUsers: number;
}
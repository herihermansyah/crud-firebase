import {Users} from "../types/users.types";

export const field: {key: keyof Users; label: string; type: string}[] = [
  {key: "firstName", label: "first name", type: "text"},
  {key: "lastName", label: "last name", type: "text"},
  {key: "email", label: "email", type: "email"},
  {key: "phone", label: "phone", type: "number"},
  {key: "username", label: "user name", type: "text"},
  {key: "password", label: "password", type: "text"},
  {key: "birthDate", label: "", type: "date"},
];

export const selectField: {
  key: keyof Users;
  label: string;
  value?: string[];
}[] = [
  {key: "gender", label: "gender", value: ["man", "women"]},
  {key: "role", label: "role", value: ["admin", "user"]},
];

export const addresField: {
  key: keyof Users["address"];
  label: string;
  type: string;
}[] = [
  {key: "address", label: "address", type: "text"},
  {key: "city", label: "city", type: "text"},
  {key: "state", label: "state", type: "text"},
  {key: "country", label: "country", type: "text"},
];

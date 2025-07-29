import { ChildDataType } from "@/schemas/new-child-form-schema";
import { User } from "@/types";

export const sampleChildrenData: ChildDataType[] = [
  {
    name_by_care_center: "Daniel A.",
    name_by_family: "Daniel",
    age: 6,
    gender: "male",
    found_date: new Date("2024-05-01"),
  },
  {
    name_by_care_center: "Mimi B.",
    name_by_family: "Mimi",
    age: 4,
    gender: "female",
    found_date: new Date("2024-03-15"),
  },
  {
    name_by_care_center: "Abel C.",
    name_by_family: "Abel",
    age: 7,
    gender: "male",
    found_date: new Date("2023-12-12"),
  },
  {
    name_by_care_center: "Sofia D.",
    name_by_family: "Sofia",
    age: 3,
    gender: "female",
    found_date: new Date("2024-01-28"),
  },
  {
    name_by_care_center: "Yonatan E.",
    name_by_family: "Yonatan",
    age: 5,
    gender: "male",
    found_date: new Date("2024-02-18"),
  },
  {
    name_by_care_center: "Hanna F.",
    name_by_family: "Hanna",
    age: 2,
    gender: "female",
    found_date: new Date("2024-06-01"),
  },
  {
    name_by_care_center: "Nahom G.",
    name_by_family: undefined,
    age: 6,
    gender: "male",
    found_date: new Date("2023-09-23"),
  },
  {
    name_by_care_center: "Ruth H.",
    name_by_family: "Ruth",
    age: null,
    gender: "female",
    found_date: new Date("2024-04-04"),
  },
  {
    name_by_care_center: "Kaleb I.",
    name_by_family: "Kaleb",
    age: 8,
    gender: "male",
    found_date: new Date("2024-07-05"),
  },
  {
    name_by_care_center: "Lily J.",
    name_by_family: undefined,
    age: 5,
    gender: "female",
    found_date: new Date("2024-06-11"),
  },
  {
    name_by_care_center: "Teddy K.",
    name_by_family: "Teddy",
    age: 4,
    gender: "male",
    found_date: new Date("2024-03-22"),
  },
  {
    name_by_care_center: "Betty L.",
    name_by_family: "Betty",
    age: 3,
    gender: "female",
    found_date: new Date("2024-02-10"),
  },
  {
    name_by_care_center: "Mekdes M.",
    name_by_family: "Mekdes",
    age: null,
    gender: "female",
    found_date: new Date("2023-11-01"),
  },
  {
    name_by_care_center: "Elias N.",
    name_by_family: "Elias",
    age: 9,
    gender: "male",
    found_date: new Date("2024-01-13"),
  },
  {
    name_by_care_center: "Selam O.",
    name_by_family: undefined,
    age: 6,
    gender: "female",
    found_date: new Date("2024-05-25"),
  },
  {
    name_by_care_center: "Brook P.",
    name_by_family: "Brook",
    age: 7,
    gender: "male",
    found_date: new Date("2024-06-14"),
  },
  {
    name_by_care_center: "Feven Q.",
    name_by_family: "Feven",
    age: 5,
    gender: "female",
    found_date: new Date("2023-10-19"),
  },
  {
    name_by_care_center: "Samuel R.",
    name_by_family: "Samuel",
    age: 4,
    gender: "male",
    found_date: new Date("2024-07-01"),
  },
  {
    name_by_care_center: "Sara S.",
    name_by_family: "Sara",
    age: 3,
    gender: "female",
    found_date: new Date("2024-07-10"),
  },
  {
    name_by_care_center: "Lidya T.",
    name_by_family: "Lidya",
    age: null,
    gender: "female",
    found_date: new Date("2024-04-29"),
  },
];

//=========================//
//  mock employee accounts //
//========================//

const mock: User = {
  id: "123",
  email: "Shigido.email.com",
  accountType: "EMPLOYEE",
  // EMPLOYEE or CLIENT

  role: "bureau-head",
  permissions: [
    // these values are not what is in the DB; hasn't been inserted into the DB yet; but take the structure.
    "view_clients",
    "create_client",
    "update_client",
    "view_employees",
  ],
  org: {
    unitId: "1",
    unitType: "BUREAU",
    deputyBureau: "BUREAU_HEAD",
  },
};

export const mockUsers: User[] = [
  {
    id: "1",
    email: "user1@gmail.com",
    role: "bureau-head",
    accountType: "EMPLOYEE",
    permissions: [
      "view_clients",
      "create_client",
      "update_client",
      "view_employees",
    ],
    org: {
      unitId: "1",
      unitType: "BUREAU",
      deputyBureau: "BUREAU_HEAD",
    },
  },
  {
    id: "2",
    email: "user2@gmail.com",
    role: "social-affairs",
    accountType: "EMPLOYEE",
    permissions: ["view_clients"],
    org: {
      unitId: "1",
      unitType: "BUREAU",
      deputyBureau: "SOCIAL_AFFAIRS",
    },
  },
  {
    id: "3",
    email: "user3@gmail.com",
    role: "adoption",
    accountType: "EMPLOYEE",
    permissions: ["view_clients", "create_client"],
    org: {
      unitId: "1",
      unitType: "BUREAU",
      deputyBureau: "CHILDREN_AFFAIRS",
    },
  },
  {
    id: "4",
    email: "user4@gmail.com",
    role: "edir",
    accountType: "EMPLOYEE",
    permissions: [
      "view_clients",
      "view_employees",
      "create_client",
      "update_client",
    ],
    org: {
      unitId: "1",
      unitType: "BUREAU",
      deputyBureau: "SOCIAL_AFFAIRS",
    },
  },
  {
    id: "5",
    email: "user5@gmail.com",
    role: "elderly-disabled",
    accountType: "EMPLOYEE",
    permissions: ["view_clients"],
    org: {
      unitId: "1",
      unitType: "BUREAU",
      deputyBureau: "SOCIAL_AFFAIRS",
    },
  },
  {
    id: "6",
    email: "user6@gmail.com",
    role: "womens",
    accountType: "EMPLOYEE",
    permissions: ["view_clients"],
    org: {
      unitId: "1",
      unitType: "BUREAU",
      deputyBureau: "WOMEN_AFFAIRS",
    },
  },
  {
    id: "7",
    email: "user7@gmail.com",
    role: "super-admin",
    accountType: "EMPLOYEE",
    permissions: ["view_clients"],
    org: {
      unitId: "1",
      unitType: "BUREAU",
      deputyBureau: "SUPER_ADMIN",
    },
  },
];

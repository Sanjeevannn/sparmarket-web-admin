import type { Customer, ClosureReason } from "@/types/customer";

const NAMES = [
  "John Doe",
  "Jane Smith",
  "Alex Kumar",
  "Sara Lee",
  "Mike Chen",
  "Priya Nair",
  "Omar Ali",
  "Yuki Tanaka",
  "Noah Brown",
  "Ava Wilson",
  "Liam Scott",
  "Mia Patel",
];

export const CUSTOMERS: Customer[] = Array.from({ length: 30 }, (_, i) => {
  const name = NAMES[i % NAMES.length];
  const closed = i % 7 === 3;
  const parts = name.split(" ");
  return {
    id: `cust-${i + 1}`,
    name,
    email: "example@gmail.com",
    phone: "0776621515",
    orders: 110 + (i % 20),
    spend: 123,
    status: closed ? "closed" : "active",
    initials: `${parts[0][0]}${parts[1]?.[0] ?? ""}`.toUpperCase(),
    gender: i % 5 === 0 ? undefined : i % 2 === 0 ? "Male" : "Female",
    accountCreated: "06/02/2025",
    dateOfBirth: "12/04/2002",
    closureReason: closed
      ? "I couldn't find the features I needed."
      : undefined,
  };
});

export const CLOSURE_REASONS: ClosureReason[] = [
  {
    id: "r1",
    reason: "I couldn't find the features I needed.",
    count: 12,
  },
  {
    id: "r2",
    reason: "I couldn't find the features I needed.",
    count: 12,
  },
  {
    id: "r3",
    reason: "I couldn't find the features I needed.",
    count: 12,
  },
  {
    id: "r4",
    reason: "I couldn't find the features I needed.",
    count: 12,
  },
  {
    id: "r5",
    reason: "I couldn't find the features I needed.",
    count: 1,
    isOther: true,
  },
];

export const CUSTOMER_STATS = {
  total: 350,
  newCustomers: 45,
  accountDeleted: 10,
};

export type CustomerStatus = "active" | "closed";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spend: number;
  status: CustomerStatus;
  avatar?: string;
  initials: string;
  gender?: string;
  accountCreated: string;
  dateOfBirth: string;
  closureReason?: string;
}

export interface ClosureReason {
  id: string;
  reason: string;
  count: number;
  isOther?: boolean;
}

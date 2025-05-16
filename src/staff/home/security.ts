export interface RecentVisitor {
  id: string;
  name: string;
  type: string;
  unit: string;
  status: "in" | "out";
  timestamp: string;
  checkoutTime?: string;
  duration?: string;
  purpose: string;
  phone: string;
  notes?: string;
  photo?: string;
}

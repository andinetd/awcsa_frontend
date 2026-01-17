export interface ServiceType {
  id: number;
  name: string;
  frequency?:
    | "RECURRING_MONTHLY"
    | "AS_NEEDED"
    | "RECURRING_YEARLY"
    | "ONE_TIME";
  description?: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MonitoringLog {
  id: number;
  supportRecordId: number;
  monitoringDate: string;
  assessedBy: string;
  currentStatus: string;
  score: number;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportService {
  id: number;
  clientId?: number;
  womenAssociationId?: number;
  serviceTypeId: number;
  dateProvided: string;
  provider: string;
  amountOrQuantity: string;
  employeeId?: number;
  facilitatorCityId: string;
  subCity: string;
  woreda: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
  serviceType?: ServiceType;
  monitoringLogs?: MonitoringLog[];
}

export interface SupportHistory {
  supportServices: SupportService[];
  totalCount: number;
  page?: number;
  limit?: number;
}

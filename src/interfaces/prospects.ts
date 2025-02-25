export interface GetProspectsResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  firstName: string;
  lastName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  userId: number;
  eventTypeId: number | null;
  contactMethodId: number;
  eventDate: string;
  budget: string;
  isConverted: boolean;
}
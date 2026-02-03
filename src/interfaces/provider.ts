export interface Provider {
  id: number;
  name: string;
  contactName: string;
  contactPhone: string;
}

export interface CreateProviderPayload {
  name: string;
  contactName?: string;
  contactPhone?: string;
}

export interface UpdateProviderPayload extends Partial<CreateProviderPayload> {}
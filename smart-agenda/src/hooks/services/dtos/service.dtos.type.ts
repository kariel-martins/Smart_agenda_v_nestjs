import type { Client, metaType } from "@/hooks/clients/dtos/client.dto.type"
import type { Professional } from "@/hooks/professionals/dtos/professional.types"

export type ServiceRequestDTO = {
  professionalId: number
  name: string
  durationMinutes: string
  price: string
}

export type ServiceUpdateRequestDTO = {
    id: number
  name: string
  durationMinutes: string
  price: string
}

export interface Service {
  id: number;
  name: string;
  durationMinutes: string;
  price: string;
  createdAt: string;
  businessId: string;
};
export type ServiceForm = Pick<Service, "name" | "durationMinutes" | "price">;

export type FindAllServiceData = {
 data: [Service],
 meta: metaType
}

export type BusinessClientData = {
   status: string
  date: string
  createdAt: string
  clients: [Client]
}


export interface findServiceByIdDTO extends Service {
  service: Service
  business: BusinessClientData
  professionals: [Professional]
}

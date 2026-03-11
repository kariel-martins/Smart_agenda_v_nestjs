import type { appointmentResponseData } from "@/hooks/appointment/dtos/appointment.dto.types";
import type { Availabity } from "@/hooks/availability/dtos/availability.dto.type";
import type { metaType } from "@/hooks/clients/dtos/client.dto.type";
import type { Service } from "@/hooks/services/dtos/service.dtos.type";

export interface Professional {
  id: number;
  businessId: string;
  name: string;
  specialty: string;
  isActive: boolean;
  createdAt: string;
};

export type ProfessionalRequestDTO = {
  name: string;
  specialty: string;
};

export type UpdateProfessionalRequestDTO = {
  id: number;
  name?: string;
  specialty?: string;
};

export type ProfessionalForm = Pick<Professional, "name" | "specialty">;

export type FindAllProfessionalData = {
  data: [Professional]
  meta: metaType
}

export interface ServiceProfData {
  service:  Service
}

interface ProfessionalAppointment extends appointmentResponseData {
  client: {
    name: string
  }
}
export interface ProfessionalById extends Professional {
  appointments: [ProfessionalAppointment]
  availabilities: [Availabity]
  service: [ServiceProfData]
}

import { z } from "zod";
import type {
  AppointmentRequestSchema,
  FindAppointmentsQuerySchema,
  QueryPaginationSchema,
  UpdateAppointmentSchema,
} from "./appointment.dto.schema";

export type AppointmentRequestData = z.infer<typeof AppointmentRequestSchema>;

export type UpdateAppointmentData = z.infer<typeof UpdateAppointmentSchema>;

export type AppointmentStatusRequest =
  | "confirm"
  | "complete"
  | "cancel"
  | "no_show";

type FindAppointmentsQueryData = z.infer<typeof FindAppointmentsQuerySchema>;

type QueryPaginationData = z.infer<typeof QueryPaginationSchema>;

export type findAllData = {
  query?: FindAppointmentsQueryData;
  page?: QueryPaginationData;
};
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "canceled"
  | "no_show";

export type AppointmentForm = {
  date: string;
  startTime: string;
  endTime: string;
  professionalId: string;
  clientId: string;
  serviceId: string;
};

type metaType = {
  total: number;
  lastPage: number;
  currentPage: number;
  totalPerPage: number;
  prevPage: number | null;
  nextPage: number | null;
};

export type appointmentResponseData = {
  id: number;
  businessId: string;
  professionalId: number;
  clientId: string;
  serviceId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  cancelReason: string;
  confirmAt: string;
  createdAt: Date;
};

export type Appointment = {
  id: number;
  businessId: string;
  professionalId: number;
  clientId: string;
  serviceId: number;

  date: string;
  startTime: string;
  endTime: string;

  status: AppointmentStatus;
  cancelReason: string | null;
  confirmAt: string | null;

  createdAt: string;

  client: {
    name: string;
  };

  professional: {
    name: string;
  };

  service: {
    name: string;
  };
};

export type AppointmentResponse = {
  data: Appointment[];
  meta: metaType;
};

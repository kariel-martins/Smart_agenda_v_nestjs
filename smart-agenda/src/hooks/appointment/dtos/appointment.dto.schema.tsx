import { z } from "zod";

export const AppointmentRequestSchema = z.object({
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  cancelReason: z.string().optional(),
  professionalId: z.coerce.number(),
  clientId: z.string(),
  serviceId: z.number(),
});


export const QueryPaginationSchema = z.object({
  page:  z.string().optional(),
  size:  z.string().optional(),
})

  export const FindAppointmentsQuerySchema = z.object({
  date:  z.string().optional(),
  status: z.string().optional(),
  confirmAt: z.date().optional(),
  createdAt:  z.date().optional()
})

export const AppointmentStatusEnum = z.enum([
  "confirm",
  "complete",
  "cancel",
  "no-show",
]);

export const UpdateAppointmentSchema = z.object({
  id: z.coerce.number(),
  cancelReason: z.string().optional(),
  status: AppointmentStatusEnum
});

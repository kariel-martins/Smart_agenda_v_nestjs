import { axiosInstance } from "@/lib/axios";

import type {
  Appointment,
  AppointmentRequestData,
  AppointmentResponse,
  UpdateAppointmentData,
} from "./dtos/appointment.dto.types";

export class AppointmentService {
  async create(data: AppointmentRequestData) {
    const result = await axiosInstance.post<Appointment>("/appointments", data);
    return result.data
  }

  async findAll() {
    const { data } = await axiosInstance.get<AppointmentResponse>('/appointments');
    return data
  }

  async update(data: UpdateAppointmentData) {
    const { id, status, ...rest} = data
    console.log(data)
    const result = await axiosInstance.patch<Appointment>(`/appointments/${id}/${status}`, rest)
    return result.data
  }
}

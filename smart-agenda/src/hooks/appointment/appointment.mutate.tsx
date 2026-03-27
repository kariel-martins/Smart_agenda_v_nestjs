import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppointmentService } from "./appointment.service";
import type { findAllData } from "../clients/dtos/client.dto.type";

const service = new AppointmentService();

export function useAppointmentFindAll(params?: findAllData) {
  return useQuery({
    queryFn: () => service.findAll(params),
    queryKey: ["appointment", params],
  });
}

export function useAppointmentCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}

export function useAppointmentUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}
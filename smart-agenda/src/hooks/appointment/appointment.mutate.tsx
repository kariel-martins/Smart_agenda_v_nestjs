import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppointmentService } from "./appointment.service";

const service = new AppointmentService();

export function useAppointmentFindAll() {
  return useQuery({
    queryFn: () => service.findAll(),
    queryKey: ["appointment"],
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
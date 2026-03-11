import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AvailabilityService } from "./availibility.service";
import type { ParamsDTO } from "./dtos/availability.dto.type";

const service = new AvailabilityService();
export function useAvailabilityFindById(params: ParamsDTO) {
  return useQuery({
    queryFn: () => service.findById(params),
    queryKey: ["availability", params],
  });
}

export function useAvailabilityFindAll(id: number) {
  return useQuery({
    queryFn: () => service.findAll(id),
    queryKey: ["availability", id],
  });
}

export function useAvailabilityCreate() {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useAvailabilityUpdate() {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: service.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useAvailabilityDelete() {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: service.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}

export function useAvailabilityUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}

export function useAvailabilityDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}
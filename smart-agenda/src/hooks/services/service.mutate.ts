import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ServiceService } from "./service.service";

const service = new ServiceService();

export function useServiceFindAll() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => service.findAll(),
  });
}

export function useServiceFindById(id: number) {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => service.findById(id),
    enabled: !!id,
  });
}

export function useServiceCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useServiceUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useServiceRemove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
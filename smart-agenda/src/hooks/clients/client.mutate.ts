import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientservice } from "./client.service";
import type { findAllData } from "./dtos/client.dto.type";

const service = new clientservice();

export function useClientFindById(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => service.findById(id),
  });
}

export function useClientFindAll(params?: findAllData) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => service.findAll(params),
  });
}

export function useClientCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useClientUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useClientDelete() {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: service.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
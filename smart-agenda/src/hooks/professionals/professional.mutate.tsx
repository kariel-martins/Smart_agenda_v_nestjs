import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfessionalService } from "./professional.service";

const service = new ProfessionalService();

export function useProfessionalFindAll() {
  return useQuery({
    queryKey: ["professional"],
    queryFn: () => service.findAll(),
  });
}

export function UseProfessionalFindById(id: number) {
  return useQuery({
    queryKey: ["professional", id],
    queryFn: () => service.findById(id),
    enabled: !!id,
  });
}

export function UseProfessionalCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}

export function UseProfessionalUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.update,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["professional"] });
      queryClient.invalidateQueries({ queryKey: ["professional", variables.id] });
    },
  });
}

export function UseProfessionalDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional"] });
    },
  });
}
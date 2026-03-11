import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { ProfessionalService } from "./professional.service";

const service = new ProfessionalService()

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
    const queryClient = new QueryClient()

    return useMutation({
        mutationFn: service.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["professional"] });
        }
    })
}

export function UseProfessionalUpdate() {
    const queryClient = new QueryClient()

    return useMutation({
        mutationFn: service.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["professional"] });
        }
    })
}

export function UseProfessionalDelete() {
    const queryClient = new QueryClient()

    return useMutation({
        mutationFn: service.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["professional"] });
        }
    })
}
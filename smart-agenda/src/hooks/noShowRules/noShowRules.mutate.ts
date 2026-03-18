import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NoShowRulesServices } from "./noShowRules.service";

const service = new NoShowRulesServices();

export function useNoShowRulesFindAll() {
  return useQuery({
    queryFn: () => service.findAll(),
    queryKey: ["no-show-rules"],
  });
}

export function useNoShowRulesCreate() {
  const queryClient = useQueryClient(); 

  return useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["no-show-rules"] });
    },
  });
}

export function useNoShowRulesUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["no-show-rules"] });
    },
  });
}

export function useNoShowRulesRemove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["no-show-rules"] });
    },
  });
}
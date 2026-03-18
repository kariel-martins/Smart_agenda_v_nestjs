import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BusinessService } from "./business.service";

const service = new BusinessService();

export function useBusinessFind() {
  return useQuery({
    queryFn: () => service.findBusiness(),
    queryKey: ["business"],
  });
}

export function useBusinessUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: service.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
  });
}
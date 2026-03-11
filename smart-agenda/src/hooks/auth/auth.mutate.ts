import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signinService, signupService } from "./auth.service";

export function registerMutate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signupService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signup"] });
    },
  });
}

export function loginMutate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signinService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signin"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { forgotPassword, resetPassword, signinService, signupService } from "./auth.service";

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

export function useForgotPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forgot-password"] });
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reset-password"] });
    },
  });
}

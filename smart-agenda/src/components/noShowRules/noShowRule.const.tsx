import type { ActionOption } from "@/hooks/noShowRules/dtos/noShowRules.dto.type";
import { Ban, CircleDollarSign, ClipboardCheck } from "lucide-react";

export const ACTION_OPTIONS: ActionOption[] = [
  {
    value: "block_booking",
    label: "Bloquear agendamento",
    description: "Impede o cliente de fazer novos agendamentos.",
    icon: <Ban className="h-4 w-4" />,
    color: "text-red-600",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  {
    value: "require_deposit",
    label: "Exigir depósito",
    description: "Cobra antecipação antes de confirmar o horário.",
    icon: <CircleDollarSign className="h-4 w-4" />,
    color: "text-amber-600",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    value: "manual_approval",
    label: "Aprovação manual",
    description: "Agendamentos ficam pendentes até sua aprovação.",
    icon: <ClipboardCheck className="h-4 w-4" />,
    color: "text-blue-600",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
];
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  Scissors,
  UserIcon,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type {
  Appointment,
  AppointmentStatus,
} from "@/hooks/appointment/dtos/appointment.dto.types";

const STATUS_CFG: Record<
  AppointmentStatus,
  { label: string; bg: string; icon: React.ReactNode }
> = {
  scheduled: {
    label: "Agendado",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock className="h-3 w-3" />,
  },
  confirmed: {
    label: "Confirmado",
    bg: "bg-green-50 text-green-700 border-green-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  completed: {
    label: "Finalizado",
    bg: "bg-gray-50 text-gray-600 border-gray-200",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  canceled: {
    label: "Cancelado",
    bg: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="h-3 w-3" />,
  },
  no_show: {
    label: "Não Compareceu",
    bg: "bg-orange-50 text-orange-700 border-orange-200",
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

export function AppointmentCard({
  data,
  onAction,
}: {
  data: Appointment;
  onAction: (
    action: "confirm" | "complete" | "cancel" | "no_show",
    appt: Appointment,
  ) => void;
}) {
  const cfg = STATUS_CFG[data.status ?? "scheduled"];
  const status = data.status ?? "scheduled";

  const isActive = ["scheduled", "confirmed"].includes(status);

  const canConfirm = status === "scheduled";
  const canComplete = isActive;
  const canCancel = isActive;
  const canNoShow = isActive;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-bold uppercase">
              {data.startTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs flex items-center gap-1 ${cfg.bg}`}
            >
              {cfg.icon}
              {cfg.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {canConfirm && (
                  <DropdownMenuItem
                    className="gap-2 text-green-600"
                    onClick={() => onAction("confirm", data)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirmar
                  </DropdownMenuItem>
                )}
                {canComplete && (
                  <DropdownMenuItem
                    className="gap-2 text-gray-700"
                    onClick={() => onAction("complete", data)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marcar Finalizado
                  </DropdownMenuItem>
                )}
                {canCancel && (
                  <DropdownMenuItem
                    className="gap-2 text-red-600"
                    onClick={() => onAction("cancel", data)}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancelar
                  </DropdownMenuItem>
                )}
                {canNoShow && (
                  <DropdownMenuItem
                    className="gap-2 text-orange-600"
                    onClick={() => onAction("no_show", data)}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Não Compareceu
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-3">
          {data.client.name ?? `Cliente #${data.clientId}`}
        </h3>

        <div className="space-y-2 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Scissors className="h-4 w-4 text-gray-400" />
            {data.service.name ?? `Serviço #${data.serviceId}`}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserIcon className="h-4 w-4 text-gray-400" />
            Prof: {data.professional.name ?? `#${data.professionalId}`}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {data.startTime} – {data.endTime} · {data.date}
          </div>
        </div>

        {data.cancelReason && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mt-3">
            {data.cancelReason}
          </p>
        )}
      </div>
    </div>
  );
}

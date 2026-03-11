import type { AppointmentStatus } from "@/hooks/appointment/dtos/appointment.dto.types";
import type { Availabity } from "@/hooks/availability/dtos/availability.dto.type";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";


export const STATUS_CFG: Record<AppointmentStatus, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  scheduled: { label: "Agendado",       badgeClass: "bg-blue-50 text-blue-700 border-blue-200",       icon: <Clock className="h-3 w-3" />       },
  confirmed: { label: "Confirmado",     badgeClass: "bg-green-50 text-green-700 border-green-200",    icon: <CheckCircle className="h-3 w-3" /> },
  completed: { label: "Finalizado",     badgeClass: "bg-gray-50 text-gray-600 border-gray-200",       icon: <CheckCircle className="h-3 w-3" /> },
  canceled: { label: "Cancelado",      badgeClass: "bg-red-50 text-red-700 border-red-200",          icon: <XCircle className="h-3 w-3" />     },
  no_show:   { label: "Não Compareceu", badgeClass: "bg-orange-50 text-orange-700 border-orange-200", icon: <AlertCircle className="h-3 w-3" /> },
};

export const MOCK_AVAILABILITIES: Availabity[] = [
  { id: 1, professionalId: 1, dayOfWeek: "monday",    startTime: "08:00", endTime: "18:00" },
  { id: 2, professionalId: 1, dayOfWeek: "wednesday", startTime: "08:00", endTime: "18:00" },
  { id: 3, professionalId: 1, dayOfWeek: "friday",    startTime: "09:00", endTime: "17:00" },
];

export const DAYS_OF_WEEK = [
  { value: "monday",    label: "Segunda-feira" },
  { value: "tuesday",   label: "Terça-feira"   },
  { value: "wednesday", label: "Quarta-feira"  },
  { value: "thursday",  label: "Quinta-feira"  },
  { value: "friday",    label: "Sexta-feira"   },
  { value: "saturday",  label: "Sábado"        },
  { value: "sunday",    label: "Domingo"       },
]

export const DAY_LABELS = Object.fromEntries(DAYS_OF_WEEK.map((d) => [d.value, d.label]));

export const DAY_ORDER  = DAYS_OF_WEEK.map((d) => d.value);
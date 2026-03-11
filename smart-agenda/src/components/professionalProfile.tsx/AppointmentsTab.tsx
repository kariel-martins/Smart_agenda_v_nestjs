import type { AppointmentStatus } from "@/hooks/appointment/dtos/appointment.dto.types";
import { CalendarDays, Clock, Scissors } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { STATUS_CFG } from "./professionalProfile.const";
import type { ProfessionalById } from "@/hooks/professionals/dtos/professional.types";

export function AppointmentsTab({
  professional,
}: {
  professional: ProfessionalById;
}) {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );

  const appointments = professional.appointments;
  const clients = professional.appointments.map((client) => client.client);
  const service = professional.service.map((service) => service.service);
  const filtered =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const countFor = (s: AppointmentStatus | "all") =>
    s === "all"
      ? appointments.length
      : appointments.filter((a) => a.status === s).length;

  return (
    <div>
      {/* Filtros de status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            { value: "all", label: "Todos" },
            { value: "scheduled", label: "Agendados" },
            { value: "confirmed", label: "Confirmados" },
            { value: "completed", label: "Finalizados" },
            { value: "cancelled", label: "Cancelados" },
            { value: "no_show", label: "Não Compareceu" },
          ] as { value: AppointmentStatus | "all"; label: string }[]
        ).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              statusFilter === opt.value
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {opt.label}
            <span
              className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                statusFilter === opt.value
                  ? "bg-white/25 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {countFor(opt.value)}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 flex flex-col items-center text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
          <CalendarDays className="h-8 w-8 mb-3 opacity-30" />
          <p className="font-medium text-sm">Nenhum agendamento encontrado</p>
          <p className="text-xs mt-1">Tente outro filtro de status.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Cliente
                  </th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">
                    Serviço
                  </th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Data / Hora
                  </th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => {
                  const cfg = STATUS_CFG[appt.status]
                  return (
                    <tr
                      key={appt.id}
                      className="border-b border-gray-50 last:border-none hover:bg-blue-50/20 transition-colors"
                    >
                      {clients.map((c) => (
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                              {(c.name ?? "C").charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                              {c.name ?? `Cliente #${appt.clientId}`}
                            </span>
                          </div>
                        </td>
                      ))}
                      {service.map((s) => (
                        <td className="py-4 px-5 hidden md:table-cell">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Scissors className="h-3.5 w-3.5 text-gray-400" />
                            {s.name ?? `Serviço #${appt.serviceId}`}
                          </div>
                        </td>
                      ))}

                      <td className="py-4 px-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">
                            {new Date(
                              appt.date + "T00:00:00",
                            ).toLocaleDateString("pt-BR")}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {appt.startTime} – {appt.endTime}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className={`text-xs w-fit flex items-center gap-1 ${cfg.badgeClass}`}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </Badge>
                          {appt.cancelReason && (
                            <span
                              className="text-[10px] text-red-400 max-w-[160px] truncate"
                              title={appt.cancelReason}
                            >
                              {appt.cancelReason}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

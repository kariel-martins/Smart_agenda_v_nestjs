import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Filter } from "lucide-react";
import type {
  Appointment,
  AppointmentForm,
  AppointmentStatus,
  AppointmentStatusRequest,
} from "@/hooks/appointment/dtos/appointment.dto.types";

import { AppointmentCard } from "@/components/appointment/appointmentCart";
import { AppointmentModal } from "@/components/appointment/appointmentModal";
import { CancelModal } from "@/components/appointment/appointment.canceModal";
import { ConfirmAction } from "@/components/appointment/appointment.confirmAction";

import {
  useAppointmentCreate,
  useAppointmentFindAll,
  useAppointmentUpdate,
} from "@/hooks/appointment/appointment.mutate";

import { errorResponce } from "@/Errors/errors";
import { ErrorMessage } from "@/components/ErrorResponce";
import { useState } from "react";
import { Clock } from "@/components/Clock";

const FILTER_OPTIONS: { label: string; value: AppointmentStatus | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Agendados", value: "scheduled" },
  { label: "Confirmados", value: "confirmed" },
  { label: "Finalizados", value: "completed" },
  { label: "Cancelados", value: "canceled" },
  { label: "Não Compareceu", value: "no_show" },
];

type PendingAction = {
  type: AppointmentStatusRequest;
  appt: Appointment;
} | null;

export function Appointment() {
  const { mutateAsync: appointmentCreate } = useAppointmentCreate();
  const { mutateAsync: appointmentUpdate } = useAppointmentUpdate();

  const { data, isLoading } = useAppointmentFindAll();

  const appointments = Array.isArray(data?.data) ? data.data : [];

  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );
  const [showCreate, setShowCreate] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [error, setError] = useState<{ message: string } | null>(null);

  const filtered =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  async function handleCreate(form: AppointmentForm) {
    setError(null);
    try {
      await appointmentCreate({
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        professionalId: Number(form.professionalId),
        clientId: form.clientId,
        serviceId: Number(form.serviceId),
      });
      setShowCreate(false);
    } catch (error: any) {
       const backendMessage = error.response?.data?.message;
      const status = error.response?.status;

      if (backendMessage) {
        setError({ message: backendMessage });
      } else {
       
        setError(errorResponce(status));
      }
      setShowCreate(false);
    }
  }

  async function applyAction(
    action: "confirm" | "complete",
    appt: Appointment,
  ) {
    setError(null);
    try {
      await appointmentUpdate({ id: appt.id, status: action });
      setPendingAction(null);
    } catch (error: any) {
       const backendMessage = error.response?.data?.message;
      const status = error.response?.status;

      if (backendMessage) {
        setError({ message: backendMessage });
      } else {
       
        setError(errorResponce(status));
      }
      setPendingAction(null);
    }
  }

  async function applyCancel(reason: string) {
    if (!pendingAction) return;
    setError(null);
    try {
      const { appt } = pendingAction;

      if (pendingAction.type === "cancel") {
        await appointmentUpdate({
          id: appt.id,
          status: "cancel",
          cancelReason: reason,
        });
      } else if (pendingAction.type === "no_show") {
        await appointmentUpdate({
          id: appt.id,
          status: "no-show",
          cancelReason: reason,
        });
      }
      setPendingAction(null);
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const status = error.response?.status;

      if (backendMessage) {
        setError({ message: backendMessage });
      } else {
       
        setError(errorResponce(status));
      }
      setPendingAction(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />

      {error && <ErrorMessage message={error.message} />}

      <div className="w-full pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar filtros */}
            <aside className="w-full md:w-60 shrink-0">
              <div className="sticky top-24">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-5 text-gray-900">
                    <Filter className="h-4 w-4" />
                    <h2 className="font-bold text-sm uppercase tracking-tight">
                      Status
                    </h2>
                  </div>
                  <div className="space-y-1">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setStatusFilter(opt.value)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm transition-all ${
                          statusFilter === opt.value
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {opt.label}
                        <span className="text-xs text-gray-400">
                          {isLoading ? (
                            <span className="inline-block h-3 w-4 bg-gray-200 rounded animate-pulse" />
                          ) : opt.value === "all" ? (
                            appointments.length
                          ) : (
                            appointments.filter((a) => a.status === opt.value)
                              .length
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <CalendarDays className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      <Clock />
                    </span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Agendamentos
                  </h1>
                </div>
                <Button
                  onClick={() => setShowCreate(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </header>

              {/* Skeleton */}
              {isLoading && (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                    >
                      <div className="flex justify-between mb-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-5 bg-gray-100 rounded-full w-20" />
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                        <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Lista */}
              {!isLoading && filtered.length > 0 && (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((appt) => (
                    <AppointmentCard
                      key={appt.id}
                      data={appt}
                      onAction={(action, appt) =>
                        setPendingAction({ type: action, appt })
                      }
                    />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <CalendarDays className="h-10 w-10 text-gray-200 mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Nenhum agendamento
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Sem registros para o filtro selecionado.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {showCreate && (
        <AppointmentModal
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {pendingAction &&
        (pendingAction.type === "cancel" ||
          pendingAction.type === "no_show") && (
          <CancelModal
            action={pendingAction.type}
            onClose={() => setPendingAction(null)}
            onConfirm={applyCancel}
          />
        )}

      {pendingAction &&
        (pendingAction.type === "confirm" ||
          pendingAction.type === "complete") && (
          <ConfirmAction
            action={pendingAction.type}
            onClose={() => setPendingAction(null)}
            onConfirm={() =>
              applyAction(
                pendingAction.type as "confirm" | "complete",
                pendingAction.appt,
              )
            }
          />
        )}
    </div>
  );
}
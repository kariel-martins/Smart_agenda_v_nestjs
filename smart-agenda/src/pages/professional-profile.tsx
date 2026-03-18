import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BadgeCheck,
  BriefcaseMedical,
  CalendarDays,
  ChevronLeft,
  Pencil,
} from "lucide-react";
import {
  UseProfessionalFindById,
  UseProfessionalUpdate,
} from "@/hooks/professionals/professional.mutate";
import {
  useServiceCreate,
  useServiceRemove,
  useServiceUpdate,
} from "@/hooks/services/service.mutate";
import type { ProfessionalForm } from "@/hooks/professionals/dtos/professional.types";
import type {
  Service,
  ServiceForm,
} from "@/hooks/services/dtos/service.dtos.type";
import { errorResponce } from "@/Errors/errors";
import { ErrorMessage } from "@/components/ErrorResponce";
import { ProfessionalModal } from "@/components/professionals/ProfessionalModal";
import { ServiceModal } from "@/components/service/ServiceModal";
import { ConfirmDelete } from "@/components/service/Service.ConfirmDelete";
import { AvailabilitiesTab } from "@/components/professionalProfile.tsx/AvailabityTab";
import { ServicesTab } from "@/components/professionalProfile.tsx/serviceTab";
import { AppointmentsTab } from "@/components/professionalProfile.tsx/AppointmentsTab";
import { AvailabilityModal } from "@/components/professionalProfile.tsx/availabityModal";
import { ConfirmDeleteAvailability } from "@/components/professionalProfile.tsx/confirmDeleteAvailabily";
import type {
  AvailabilityForm,
  Availabity,
} from "@/hooks/availability/dtos/availability.dto.type";
import {
  useAvailabilityCreate,
  useAvailabilityDelete,
} from "@/hooks/availability/availability.mutate";
import type { Appointment } from "@/hooks/appointment/dtos/appointment.dto.types";

type Tab = "servicos" | "disponibilidades" | "agendamentos";

// ── Skeleton do perfil ──────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero card skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-gray-200 shrink-0" />

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-32" />
            <div className="flex gap-2">
              <div className="h-5 bg-gray-100 rounded-full w-16" />
              <div className="h-5 bg-gray-100 rounded w-28" />
            </div>
          </div>

          {/* Botão editar */}
          <div className="h-9 w-28 bg-gray-100 rounded-xl shrink-0" />
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-50">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-xl mx-auto bg-gray-100 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1 h-10 bg-gray-100 rounded-xl" />
        ))}
      </div>

      {/* Conteúdo da aba skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-xl"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-100 rounded-lg" />
              <div className="h-8 w-8 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export function ProfessionalProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const professionalId = Number(id);

  const { mutateAsync: professionalUpdate } = UseProfessionalUpdate();
  const { data: professional, isLoading } = UseProfessionalFindById(professionalId);

  const { mutateAsync: serviceCreate } = useServiceCreate();
  const { mutateAsync: serviceUpdate } = useServiceUpdate();
  const { mutateAsync: serviceRemove } = useServiceRemove();

  const { mutateAsync: availabilityCreate } = useAvailabilityCreate();
  const { mutateAsync: availabilityDelete } = useAvailabilityDelete();

  const [activeTab, setActiveTab] = useState<Tab>("servicos");
  const [editProfModal, setEditProfModal] = useState(false);
  const [serviceModal, setServiceModal] = useState<Service | null | "new">(null);
  const [availModal, setAvailModal] = useState(false);
  const [delAvailTarget, setDelAvailTarget] = useState<Availabity | null>(null);
  const [delServiceTarget, setDelServiceTarget] = useState<Service | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);

  const appointments = Array.isArray(professional?.appointments)
    ? professional.appointments
    : ([] as Appointment[]);
  const allServices = Array.isArray(professional?.service)
    ? professional.service
    : [];

  async function handleUpdateProfessional(form: ProfessionalForm) {
    setError(null);
    try {
      await professionalUpdate({ ...form, id: professional?.id! });
      setEditProfModal(false);
    } catch (err: any) {
      setError(errorResponce(err.status));
    }
  }

  async function handleSaveService(form: ServiceForm, sid?: number) {
    setError(null);
    try {
      if (sid) {
        await serviceUpdate({ ...form, id: sid });
      } else {
        await serviceCreate({ ...form, professionalId: professional?.id! });
      }
    } catch (err: any) {
      setError(errorResponce(err.status));
    }
    setServiceModal(null);
  }

  async function handleDeleteService() {
    if (!delServiceTarget) return;
    setError(null);
    try {
      await serviceRemove(delServiceTarget.id);
    } catch (err: any) {
      setError(errorResponce(err.status));
    }
    setDelServiceTarget(null);
  }

  async function handleAddAvailability(form: AvailabilityForm) {
    try {
      await availabilityCreate({ ...form, professinalId: professionalId });
      setAvailModal(false);
    } catch (err: any) {
      setError(errorResponce(err.status));
    }
  }

  async function handleDeleteAvailability() {
    if (!delAvailTarget) return;
    try {
      await availabilityDelete({
        professinalId: professionalId,
        id: delAvailTarget.id,
      });
      setDelAvailTarget(null);
    } catch (err: any) {
      setError(errorResponce(err.status));
    }
  }

  const TABS: { id: Tab; label: string; count: number }[] = professional
    ? [
        { id: "servicos", label: "Serviços", count: professional.service.length },
        {
          id: "disponibilidades",
          label: "Disponibilidades",
          count: professional.availabilities.length,
        },
        {
          id: "agendamentos",
          label: "Agendamentos",
          count: professional.appointments.length,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />
      {error && <ErrorMessage message={error.message} />}

      <main className="max-w-5xl mx-auto pt-24 pb-12 px-4 md:px-8">
        {/* Voltar */}
        <button
          onClick={() => navigate("/profissionais")}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para Profissionais
        </button>

        {/* Skeleton enquanto carrega */}
        {isLoading && <ProfileSkeleton />}

        {/* Profissional não encontrado — só mostra após carregamento */}
        {!isLoading && !professional && (
          <div className="py-24 flex flex-col items-center text-gray-400">
            <div className="h-10 w-10 mb-3 opacity-30 text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <p className="font-semibold text-lg text-gray-900">
              Profissional não encontrado
            </p>
            <p className="text-sm mt-1">
              Verifique o ID na URL ou volte para a lista.
            </p>
            <Button
              variant="outline"
              className="mt-6 gap-2"
              onClick={() => navigate("/profissionais")}
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
        )}

        {/* Conteúdo real — só renderiza quando os dados chegaram */}
        {!isLoading && professional && (
          <>
            {/* ── Hero card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-20 w-20 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-extrabold">
                    {professional.name.charAt(0)}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow ${
                      professional.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-2xl font-extrabold text-gray-900 truncate">
                      {professional.name}
                    </h1>
                    {professional.isActive && (
                      <BadgeCheck className="h-5 w-5 text-blue-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600 font-medium text-sm mb-3">
                    <BriefcaseMedical className="h-4 w-4" />
                    {professional.specialty}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        professional.isActive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }
                    >
                      {professional.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Desde{" "}
                      {new Date(professional.createdAt).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                </div>

                {/* Ação */}
                <Button
                  onClick={() => setEditProfModal(true)}
                  variant="outline"
                  className="shrink-0 gap-2 rounded-xl h-9 border-gray-200 text-sm"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar perfil
                </Button>
              </div>

              {/* Stats rápidas */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-50">
                {[
                  {
                    label: "Serviços",
                    value: allServices.length,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Disponibilidades",
                    value: professional.availabilities.length,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    label: "Agendamentos",
                    value: appointments.length,
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div
                      className={`${s.bg} w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2`}
                    >
                      <span className={`text-base font-extrabold ${s.color}`}>
                        {s.value}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                      activeTab === tab.id
                        ? "bg-white/25 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* ── Conteúdo da aba ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {activeTab === "servicos" && (
                <ServicesTab
                  services={allServices}
                  onEdit={(s) => setServiceModal(s)}
                  onDelete={(s) => setDelServiceTarget(s)}
                  onNew={() => setServiceModal("new")}
                />
              )}
              {activeTab === "disponibilidades" && (
                <AvailabilitiesTab
                  availabilities={professional.availabilities}
                  onNew={() => setAvailModal(true)}
                  onDelete={(a) => setDelAvailTarget(a)}
                />
              )}
              {activeTab === "agendamentos" && (
                <AppointmentsTab professional={professional} />
              )}
            </div>
          </>
        )}
      </main>

      {/* ── Modais ── */}
      {editProfModal && professional && (
        <ProfessionalModal
          professional={professional}
          onClose={() => setEditProfModal(false)}
          onSave={handleUpdateProfessional}
        />
      )}

      {serviceModal !== null && (
        <ServiceModal
          service={serviceModal === "new" ? null : serviceModal}
          onClose={() => setServiceModal(null)}
          onSave={handleSaveService}
        />
      )}

      {delServiceTarget && (
        <ConfirmDelete
          name={delServiceTarget.name}
          onClose={() => setDelServiceTarget(null)}
          onConfirm={handleDeleteService}
        />
      )}

      {availModal && (
        <AvailabilityModal
          onClose={() => setAvailModal(false)}
          onSave={handleAddAvailability}
        />
      )}

      {delAvailTarget && (
        <ConfirmDeleteAvailability
          availability={delAvailTarget}
          onClose={() => setDelAvailTarget(null)}
          onConfirm={handleDeleteAvailability}
        />
      )}
    </div>
  );
}
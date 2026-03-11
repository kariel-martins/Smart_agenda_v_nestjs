import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  Search,
  Users,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  UseProfessionalCreate,
  UseProfessionalDelete,
  useProfessionalFindAll,
  UseProfessionalUpdate,
} from "@/hooks/professionals/professional.mutate";
import type {
  Professional,
  ProfessionalForm,
} from "@/hooks/professionals/dtos/professional.types";
import { errorResponce } from "@/Errors/errors";
import { ErrorMessage } from "@/components/ErrorResponce";
import { ProfessionalCard } from "@/components/professionals/ProfessionalCard";
import { ProfessionalModal } from "@/components/professionals/ProfessionalModal";
import { ConfirmDelete } from "@/components/service/Service.ConfirmDelete";

export function Professionals() {
  const { mutateAsync: professionalCreate } = UseProfessionalCreate();
  const { mutateAsync: professionalUpdate } = UseProfessionalUpdate();
  const { mutateAsync: professionalDelete } = UseProfessionalDelete();

  const {data} = useProfessionalFindAll()

  const professionals = Array.isArray(data?.data) ? data.data : []
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [modal, setModal] = useState<Professional | null | "new">(null);
  const [delTarget, setDelTarget] = useState<Professional | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);

  const filtered = professionals.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase());
    const matchActive = filterActive === null || p.isActive === filterActive;
    return matchSearch && matchActive;
  });

  const totalActive = professionals.filter((p) => p.isActive).length;

  async function handleSave(form: ProfessionalForm, id?: number) {
    setError(null);
    if (id) {
      try {
        await professionalUpdate({ ...form, id });
      } catch (error: any) {
        setError(errorResponce(error.status));
      }
    } else {
      try {
         await professionalCreate(form);
      } catch (error: any) {
        console.log(error.response.status);
        setError(errorResponce(error.status));
      }
    }
    setModal(null);
  }

  async function handleDelete() {
    if (!delTarget) return;
    setError(null)
    try {
      await professionalDelete(delTarget.id);
      setDelTarget(null);
    } catch (error: any) {
      setError(errorResponce(error.status));
      setDelTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />
      {error && <ErrorMessage message={error.message} />}
      <main className="max-w-7xl mx-auto pt-24 pb-12 px-4 md:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[
            {
              label: "Profissionais Ativos",
              value: String(totalActive),
              icon: CheckCircle,
              color: "text-green-600",
              bg: "bg-green-100",
            },
            {
              label: "Total na Equipe",
              value: String(professionals.length),
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-100",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className={`${s.bg} p-3 rounded-xl`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Profissionais
            </h1>
            <p className="text-gray-500">
              Gerencie a equipe e suas especialidades.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome ou especialidade..."
                className="pl-10 w-64 bg-white border-none shadow-sm h-11"
              />
            </div>
            {/* isActive filter → query param GET /v1/profissionais?isActive=true */}
            <Button
              variant="outline"
              onClick={() =>
                setFilterActive(
                  filterActive === null
                    ? true
                    : filterActive === true
                      ? false
                      : null,
                )
              }
              className={`h-11 rounded-xl px-4 gap-2 border-none shadow-sm ${filterActive === true ? "bg-green-50 text-green-700" : filterActive === false ? "bg-gray-100 text-gray-500" : "bg-white"}`}
            >
              {filterActive === true ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
              {filterActive === true
                ? "Ativos"
                : filterActive === false
                  ? "Inativos"
                  : "Todos"}
            </Button>
            <Button
              onClick={() => setModal("new")}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 h-11 shadow-lg shadow-blue-100"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Contratar
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProfessionalCard
              key={p.id}
              data={p}
              onEdit={(p) => setModal(p)}
              onDelete={(p) => setDelTarget(p)}
              onAvailability={(p) =>
                (window.location.href = `/profissionais/${p.id}/profile-professional/:id`)
              }
            />
          ))}
          <div
            onClick={() => setModal("new")}
            className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-gray-50/30 hover:bg-blue-50/30 hover:border-blue-200 transition-all cursor-pointer group"
          >
            <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <UserPlus className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
            </div>
            <p className="font-bold text-gray-900 text-sm">Adicionar Membro</p>
            <p className="text-xs text-gray-400 mt-1">Expanda sua equipe</p>
          </div>
        </div>
      </main>

      {modal !== null && (
        <ProfessionalModal
          professional={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {delTarget && (
        <ConfirmDelete
          name={delTarget.name}
          onClose={() => setDelTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

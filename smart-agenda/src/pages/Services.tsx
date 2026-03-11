import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import type {
  Service,
  ServiceForm,
} from "@/hooks/services/dtos/service.dtos.type";
import { ServiceCard } from "@/components/service/ServiceCard";
import { ServiceModal } from "@/components/service/ServiceModal";
import { ConfirmDelete } from "@/components/service/Service.ConfirmDelete";
import {
  useServiceCreate,
  useServiceFindAll,
  useServiceRemove,
  useServiceUpdate,
} from "@/hooks/services/service.mutate";
import { errorResponce } from "@/Errors/errors";
import { ErrorMessage } from "@/components/ErrorResponce";

export function Services() {
  const { mutateAsync: serviceCreate } = useServiceCreate();
  const { mutateAsync: serviceUpdate } = useServiceUpdate();
  const { mutateAsync: serviceRemove } = useServiceRemove();

  const { data } = useServiceFindAll();

  const services = Array.isArray(data?.data) ? data.data : [];

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Service | null | "new">(null);
  const [delTarget, setDelTarget] = useState<Service | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleSave(form: ServiceForm, id?: number) {
    setError(null);
    try {
      if (id) {
        await serviceUpdate({ ...form, id });
      } else {
        await serviceCreate(form);
      }
    } catch (error: any) {
      setError(errorResponce(error.status));
    }
    setModal(null);
  }

  async function handleDelete() {
    setError(null);
    if (!delTarget) return;
    try {
      await serviceRemove(delTarget.id);
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Serviços
            </h1>
            <p className="text-gray-500 mt-1">
              {services.length}{" "}
              {services.length === 1
                ? "serviço cadastrado"
                : "serviços cadastrados"}
            </p>
          </div>
          <Button
            onClick={() => setModal("new")}
            className="bg-blue-600 hover:bg-blue-700 h-12 px-6 rounded-xl shadow-lg shadow-blue-100"
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Serviço
          </Button>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome..."
              className="pl-10 h-12 bg-white border-none shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((s) => (
            <ServiceCard
              key={s.id}
              data={s}
              onEdit={(s) => setModal(s)}
              onDelete={(s) => setDelTarget(s)}
            />
          ))}
          <button
            onClick={() => setModal("new")}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group min-h-[180px]"
          >
            <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-medium">Adicionar serviço</span>
          </button>
        </div>

        {filtered.length === 0 && search && (
          <div className="text-center py-20 text-gray-400">
            <p className="font-medium">Nenhum resultado para "{search}"</p>
          </div>
        )}
      </main>

      {modal !== null && (
        <ServiceModal
          service={modal === "new" ? null : modal}
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

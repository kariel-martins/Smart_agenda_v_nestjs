import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { ClientRow } from "@/components/clients/clientRow";
import { ClientModal } from "@/components/clients/clientModal";
import { ConfirmDelete } from "@/components/service/Service.ConfirmDelete";
import type { Client, ClientForm } from "@/hooks/clients/dtos/client.dto.type";
import {
  useClientCreate,
  useClientDelete,
  useClientFindAll,
  useClientUpdate,
} from "@/hooks/clients/client.mutate";
import { ErrorMessage } from "@/components/ErrorResponce";
import { errorResponce } from "@/Errors/errors";

export function Customers() {
  const { mutateAsync: clientCreate } = useClientCreate();
  const { mutateAsync: clientUpdate } = useClientUpdate();
  const { mutateAsync: clientDelete } = useClientDelete();

  
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Client | null | "new">(null);
  const [delTarget, setDelTarget] = useState<Client | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [numPage, setNumPage] = useState<number>(1)
  
  const { data, isLoading} = useClientFindAll({
    page: numPage,
    size: 10
  })
  
  const clients = Array.isArray(data?.data) ? data.data : [];
  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  async function handleSave(form: ClientForm, id?: string) {
    setError(null);
    try {
      if (id) {
        await clientUpdate({ ...form, id });
      } else {
        await clientCreate(form);
      }
      setModal(null);
    } catch (error: any) {
      setError(errorResponce(error.status));
      setModal(null);
    }
  }

  async function handleDelete() {
    if (!delTarget) return;
    try {
      await clientDelete(delTarget.id);
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Clientes
            </h1>
            <p className="text-gray-500">
              {data?.meta.total} clientes na sua base.
            </p>
          </div>
          <Button
            onClick={() => setModal("new")}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail ou telefone..."
              className="pl-10 bg-gray-50/50 border-none h-11"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Cliente
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">
                    Telefone
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 hidden lg:table-cell">
                    Agendamentos
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    No-Shows
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="py-4 px-4 text-right" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <ClientRow
                    key={c.id}
                    data={c}
                    onEdit={(c) => setModal(c)}
                    onDelete={(c) => setDelTarget(c)}
                  />
                ))}
                { filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      {isLoading ? "Carregando" : search
                        ? `Nenhum resultado para "${search}"`
                        : "Nenhum cliente cadastrado."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              page { data?.meta.currentPage} de { data?.meta.lastPage}
            </span>
            <div className="flex gap-2">
              <Button onClick={() => setNumPage((prev) => prev -1)} variant="outline" size="sm" disabled={numPage <= 1} className="bg-white">
                Anterior
              </Button>
              <Button onClick={() => setNumPage((prev) => prev +1)} variant="outline" size="sm" disabled={numPage >= (data?.meta.lastPage ?? 1)} className="bg-white">
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </main>

      {modal !== null && (
        <ClientModal
          client={modal === "new" ? null : modal}
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

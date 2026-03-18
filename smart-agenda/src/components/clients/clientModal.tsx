import { Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import type { Client, ClientForm } from "@/hooks/clients/dtos/client.dto.type";

export function ClientModal({
  client,
  onClose,
  onSave,
}: {
  client: Client | null;
  onClose: () => void;
  onSave: (form: ClientForm, id?: string) => Promise<void>;
}) {
  const [form, setForm] = useState<ClientForm>(
    client
      ? { name: client.name, phone: client.phone, email: client.email }
      : { name: "", phone: "", email: "" },
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSave(form, client?.id);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {client ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nome completo"
              className="h-11 bg-gray-50 border-gray-200"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">
              Telefone <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="(11) 99999-0000"
              className="h-11 bg-gray-50 border-gray-200"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">
              E-mail <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="cliente@email.com"
              className="h-11 bg-gray-50 border-gray-200"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2"
            >
              <Save className="h-4 w-4" />
              {loading
                ? "Salvando..."
                : client
                  ? "Salvar alterações"
                  : "Criar cliente"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-xl px-5"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

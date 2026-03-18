import type { Professional, ProfessionalForm } from "@/hooks/professionals/dtos/professional.types";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function ProfessionalModal({
  professional,
  onClose,
  onSave,
}: {
  professional: Professional | null;
  onClose: () => void;
  onSave: (form: ProfessionalForm, id?: number) => Promise<void>;
}) {
  const [form, setForm] = useState<ProfessionalForm>(
    professional
      ? { name: professional.name, specialty: professional.specialty }
      : { name: "", specialty: "" },
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSave(form, professional?.id);
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
            {professional ? "Editar Profissional" : "Novo Profissional"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* name → POST/PUT body */}
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
          {/* specialty → POST/PUT body */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">
              Especialidade <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.specialty}
              onChange={(e) =>
                setForm((p) => ({ ...p, specialty: e.target.value }))
              }
              placeholder="Ex: Barbeiro, Colorista..."
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
                : professional
                  ? "Salvar alterações"
                  : "Contratar"}
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
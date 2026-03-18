import { Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import type { AvailabilityForm } from "@/hooks/availability/dtos/availability.dto.type";
import { Label } from "../ui/label";
import { DAYS_OF_WEEK } from "./professionalProfile.const";

export function AvailabilityModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (form: AvailabilityForm) => Promise<void>;
}) {
  const [form, setForm] = useState<AvailabilityForm>({
    dayOfWeek: "monday",
    startTime: "08:00",
    endTime:   "18:00",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">Novo Horário</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">
              Dia da Semana <span className="text-red-500">*</span>
            </Label>
            <select
              value={form.dayOfWeek}
              onChange={(e) => setForm((p) => ({ ...p, dayOfWeek: e.target.value }))}
              required
              className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Início <span className="text-red-500">*</span>
              </Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                className="h-11 bg-gray-50 border-gray-200"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Fim <span className="text-red-500">*</span>
              </Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                className="h-11 bg-gray-50 border-gray-200"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar horário"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="h-11 rounded-xl px-5">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
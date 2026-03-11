import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Clock, CalendarDays } from "lucide-react";

type Availability = {
  id: number;
  professionalId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

const DAYS_OF_WEEK = [
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

const DAY_LABELS: Record<string, string> = Object.fromEntries(DAYS_OF_WEEK.map((d) => [d.value, d.label]));

// Mock — na integração real viria de GET /v1/professional/:id/disponibilidade
const MOCK_AVAILABILITIES: Availability[] = [
  { id: 1, professionalId: 1, dayOfWeek: "monday", startTime: "08:00", endTime: "18:00" },
  { id: 2, professionalId: 1, dayOfWeek: "tuesday", startTime: "08:00", endTime: "18:00" },
  { id: 3, professionalId: 1, dayOfWeek: "friday", startTime: "09:00", endTime: "17:00" },
];

type NewAvailability = Omit<Availability, "id" | "professionalId">;

const EMPTY_FORM: NewAvailability = { dayOfWeek: "monday", startTime: "08:00", endTime: "18:00" };

export function ProfessionalAvailability({ professionalId = 1 }: { professionalId?: number }) {
  const [availabilities, setAvailabilities] = useState<Availability[]>(MOCK_AVAILABILITIES);
  const [form, setForm] = useState<NewAvailability>(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: keyof NewAvailability, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // POST /v1/professional/:id/disponibilidade
      const res = await fetch(`/v1/professional/${professionalId}/disponibilidade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data: Availability = await res.json();
        setAvailabilities((prev) => [...prev, data]);
        setForm(EMPTY_FORM);
        setShowForm(false);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(availId: number) {
    // DELETE /v1/professional/:profId/disponibilidade/:availId
    await fetch(`/v1/professional/${professionalId}/disponibilidade/${availId}`, { method: "DELETE" });
    setAvailabilities((prev) => prev.filter((a) => a.id !== availId));
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />

      <main className="max-w-2xl mx-auto pt-24 pb-12 px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <CalendarDays className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Disponibilidade</h1>
              <p className="text-gray-500 text-sm">Defina os horários disponíveis do profissional.</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5 gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {/* Formulário de Novo Horário */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-5">Novo Horário</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Dia da Semana</Label>
                <select
                  value={form.dayOfWeek}
                  onChange={(e) => update("dayOfWeek", e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-700">Início</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => update("startTime", e.target.value)}
                    className="h-11 bg-gray-50/50 border-gray-200"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-700">Fim</Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => update("endTime", e.target.value)}
                    className="h-11 bg-gray-50/50 border-gray-200"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 rounded-xl">
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="h-11 rounded-xl">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Disponibilidades */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {availabilities.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400">
              <Clock className="h-8 w-8 mb-3 text-gray-200" />
              <p className="font-medium">Nenhum horário cadastrado</p>
              <p className="text-sm">Adicione a disponibilidade do profissional.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {availabilities.map((avail) => (
                <li key={avail.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-50 px-3 py-1.5 rounded-lg">
                      <span className="text-sm font-bold text-purple-700">
                        {DAY_LABELS[avail.dayOfWeek] ?? avail.dayOfWeek}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {avail.startTime} – {avail.endTime}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                    onClick={() => handleDelete(avail.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
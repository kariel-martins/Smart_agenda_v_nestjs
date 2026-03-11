import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Plus, Trash2, Pencil, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type NoShowAction = "block_booking";

type NoShowRule = {
  id: number;
  maxRatePercent: number;
  action: NoShowAction;
};

const ACTION_LABELS: Record<NoShowAction, string> = {
  block_booking: "Bloquear agendamento",
};

// Mock — na integração real viria de GET /v1/regras-sem-exibição
const MOCK_RULES: NoShowRule[] = [
  { id: 1, maxRatePercent: 30, action: "block_booking" },
];

export function NoShowRules() {
  const [rules, setRules] = useState<NoShowRule[]>(MOCK_RULES);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ maxRatePercent: "", action: "block_booking" as NoShowAction });
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditId(null);
    setForm({ maxRatePercent: "", action: "block_booking" });
    setShowForm(true);
  }

  function openEdit(rule: NoShowRule) {
    setEditId(rule.id);
    setForm({ maxRatePercent: String(rule.maxRatePercent), action: rule.action });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = { maxRatePercent: Number(form.maxRatePercent), action: form.action };
    try {
      if (editId !== null) {
        // PUT /v1/sem-exibir-regras/:id
        await fetch(`/v1/sem-exibir-regras/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setRules((prev) => prev.map((r) => (r.id === editId ? { ...r, ...payload } : r)));
      } else {
        // POST /v1/regras-sem-exibição
        const res = await fetch("/v1/regras-sem-exibição", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data: NoShowRule = await res.json();
          setRules((prev) => [...prev, data]);
        }
      }
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    // DELETE /v1/sem-exibir-regras/:id
    await fetch(`/v1/sem-exibir-regras/${id}`, { method: "DELETE" });
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />

      <main className="max-w-2xl mx-auto pt-24 pb-12 px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-xl">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Regras de No-Show</h1>
              <p className="text-gray-500 text-sm">Defina ações automáticas para clientes faltosos.</p>
            </div>
          </div>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5 gap-2">
            <Plus className="h-4 w-4" />
            Nova Regra
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-5">{editId ? "Editar Regra" : "Nova Regra"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">
                  Taxa máxima de no-show (%)
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="Ex: 30"
                  value={form.maxRatePercent}
                  onChange={(e) => setForm((p) => ({ ...p, maxRatePercent: e.target.value }))}
                  className="h-11 bg-gray-50/50 border-gray-200"
                  required
                />
                <p className="text-xs text-gray-400">
                  Quando o cliente atingir essa porcentagem de faltas, a ação abaixo será aplicada.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700">Ação</Label>
                <select
                  value={form.action}
                  onChange={(e) => setForm((p) => ({ ...p, action: e.target.value as NoShowAction }))}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="block_booking">Bloquear agendamento</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 rounded-xl gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="h-11 rounded-xl">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Regras */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {rules.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400">
              <ShieldAlert className="h-8 w-8 mb-3 text-gray-200" />
              <p className="font-medium">Nenhuma regra cadastrada</p>
              <p className="text-sm">Crie regras para proteger sua agenda.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {rules.map((rule) => (
                <li key={rule.id} className="flex items-center justify-between p-5 hover:bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 px-3 py-1.5 rounded-lg">
                      <span className="text-lg font-extrabold text-red-600">{rule.maxRatePercent}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Taxa máxima de faltas</p>
                      <Badge variant="outline" className="mt-1 text-xs bg-orange-50 text-orange-700 border-orange-200">
                        {ACTION_LABELS[rule.action]}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-blue-600"
                      onClick={() => openEdit(rule)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600"
                      onClick={() => handleDelete(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
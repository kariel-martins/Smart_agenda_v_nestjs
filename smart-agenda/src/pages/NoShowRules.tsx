import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Plus, Trash2, Pencil, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useNoShowRulesCreate,
  useNoShowRulesFindAll,
  useNoShowRulesRemove,
  useNoShowRulesUpdate,
} from "@/hooks/noShowRules/noShowRules.mutate";
import type {
  NoShowRequest,
  NoShowRuleData,
} from "@/hooks/noShowRules/dtos/noShowRules.dto.type";
import { errorResponce } from "@/Errors/errors";
import { ErrorMessage } from "@/components/ErrorResponce";
import { ActionSelect, getAction } from "@/components/noShowRules/ActionSelect";

export function NoShowRules() {
  const { mutateAsync: noShowRulesCreate } = useNoShowRulesCreate();
  const { mutateAsync: noShowRulesUpdate } = useNoShowRulesUpdate();
  const { mutateAsync: noShowRulesRemove } = useNoShowRulesRemove();

  const { data, isLoading } = useNoShowRulesFindAll();
  const rules = Array.isArray(data) ? data : [];

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [form, setForm] = useState<NoShowRequest>({
    maxRatePercent: 30,
    action: "block_booking",
  });
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditId(null);
    setForm({ maxRatePercent: 30, action: "block_booking" });
    setShowForm(true);
  }

  function openEdit(rule: NoShowRuleData) {
    setEditId(rule.id);
    setForm({
      maxRatePercent: Number(rule.maxRatePercent),
      action: rule.action,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      maxRatePercent: Number(form.maxRatePercent),
      action: form.action,
    } as NoShowRequest;
    try {
      if (editId !== null) {
        await noShowRulesUpdate({ id: editId, ...payload });
      } else {
        await noShowRulesCreate(payload);
      }
      setShowForm(false);
    } catch (error: any) {
      setError(errorResponce(error.status));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    await noShowRulesRemove(id);
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <NavBar />
      {error && <ErrorMessage message={error.message} />}

      <main className="max-w-2xl mx-auto pt-24 pb-12 px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2.5 rounded-xl shadow-md shadow-red-200">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Regras de No-Show
              </h1>
              <p className="text-gray-500 text-sm">
                Defina ações automáticas para clientes faltosos.
              </p>
            </div>
          </div>
          <Button
            onClick={openCreate}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5 gap-2 shadow-sm shadow-blue-100"
          >
            <Plus className="h-4 w-4" />
            Nova Regra
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-5">
              {editId ? "Editar Regra" : "Nova Regra"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      maxRatePercent: e.target.value as any,
                    }))
                  }
                  className="h-11 bg-gray-50 border-gray-200"
                  required
                />
                <p className="text-xs text-gray-400">
                  Quando o cliente atingir essa porcentagem de faltas, a ação
                  abaixo será aplicada.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Ação
                </Label>
                <ActionSelect
                  value={form.action}
                  onChange={(v) => setForm((p) => ({ ...p, action: v }))}
                />
              </div>
              <div className="flex gap-3 pt-1">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 rounded-xl gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="h-11 rounded-xl"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Regras */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <ul className="divide-y divide-gray-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-5 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 rounded-lg w-14 h-9" />
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-36" />
                      <div className="h-4 bg-gray-100 rounded-full w-24" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                    <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                  </div>
                </li>
              ))}
            </ul>
          ) : rules.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400">
              <ShieldAlert className="h-8 w-8 mb-3 text-gray-200" />
              <p className="font-medium">Nenhuma regra cadastrada</p>
              <p className="text-sm">Crie regras para proteger sua agenda.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {rules.map((rule) => {
                const action = getAction(rule.action);
                return (
                  <li
                    key={rule.id}
                    className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-red-50 px-3 py-1.5 rounded-lg">
                        <span className="text-lg font-extrabold text-red-600">
                          {rule.maxRatePercent}%
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Taxa máxima de faltas
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-xs flex items-center gap-1 w-fit ${action.badgeClass}`}
                        >
                          <span className={action.color}>{action.icon}</span>
                          {action.label}
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
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Save,
  Globe,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  useBusinessFind,
  useBusinessUpdate,
} from "@/hooks/business/business.mutate";
import type { BusinessProfile } from "@/hooks/business/dtos/business.dto.type";

export function BusinessProfile() {
  const { mutateAsync: businessUpdate } = useBusinessUpdate();
  const { data: businessData, isLoading: isLoadingData } = useBusinessFind();

  const [form, setForm] = useState<BusinessProfile>({
    name: "",
    slug: null,
    phone: null,
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (businessData) {
      setForm({
        name: businessData.name ?? "",
        slug: businessData.slug ?? null,
        phone: businessData.phone ?? null,
        email: businessData.email ?? "",
        active: businessData.active,
        timezone: businessData.timezone,
        createdAt: businessData.createdAt,
      });
    }
  }, [businessData]);

  function update(field: keyof BusinessProfile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await businessUpdate({
        name: form.name,
        slug: form.slug ?? undefined,
        phone: form.phone ?? undefined,
        email: form.email,
      });
      setSaved(true);
      setIsDirty(false);
      setTimeout(() => setSaved(false), 4000);
    } finally {
      setLoading(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <NavBar />
        <main className="max-w-2xl mx-auto pt-24 pb-12 px-4 md:px-8">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-gray-200 rounded-xl" />
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="h-3 bg-gray-100 rounded w-64" />
              </div>
            </div>
            {/* Status bar skeleton */}
            <div className="h-12 bg-gray-100 rounded-xl" />
            {/* Form card skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-28" />
                <div className="h-11 bg-gray-100 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-36" />
                <div className="h-11 bg-gray-100 rounded-lg" />
                <div className="h-3 bg-gray-100 rounded w-72" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-11 bg-gray-100 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-11 bg-gray-100 rounded-lg" />
                </div>
              </div>
              {/* Footer skeleton */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="h-3 bg-gray-100 rounded w-40" />
                <div className="h-10 bg-gray-200 rounded-xl w-36" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <NavBar />

      <main className="max-w-2xl mx-auto pt-24 pb-16 px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-md shadow-blue-200">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Perfil do Negócio
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-[52px]">
            Gerencie as informações públicas da sua empresa.
          </p>
        </div>

        {/* Status Bar */}
        {businessData && (
          <div className="mb-4 flex flex-wrap items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              Criado em{" "}
              <strong className="text-gray-700">
                {new Date(form.createdAt!).toLocaleDateString("pt-BR")}
              </strong>
            </span>
            {form.timezone && (
              <>
                <span className="text-gray-200">|</span>
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  <strong className="text-gray-700">{form.timezone}</strong>
                </span>
              </>
            )}
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1.5">
              {form.active ? (
                <Wifi className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <WifiOff className="h-3.5 w-3.5 text-red-400" />
              )}
              <span
                className={
                  form.active
                    ? "text-emerald-600 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {form.active ? "Ativo" : "Inativo"}
              </span>
            </span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  Nome do Negócio
                  <span className="text-red-400 text-xs">*</span>
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ex: Barbearia do João"
                  className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  Slug (URL pública)
                </Label>
                <div className="flex items-center h-11 rounded-lg border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all overflow-hidden">
                  <span className="px-3 text-gray-400 text-sm border-r border-gray-200 h-full flex items-center bg-gray-100 shrink-0">
                    seuapp.com/
                  </span>
                  <input
                    value={form.slug ?? ""}
                    onChange={(e) => update("slug", e.target.value)}
                    placeholder="minha-barbearia"
                    className="flex-1 px-3 bg-transparent text-sm outline-none text-gray-800 placeholder:text-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Identifica sua página pública de agendamento. Use apenas
                  letras, números e hífens.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    Telefone
                  </Label>
                  <Input
                    value={form.phone ?? ""}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="(11) 90000-0000"
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    E-mail
                    <span className="text-red-400 text-xs">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="contato@empresa.com"
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-4">
              <p className="text-xs text-gray-400">
                {isDirty && !saved && "Você tem alterações não salvas."}
                {saved && (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Alterações salvas com sucesso!
                  </span>
                )}
              </p>
              <Button
                type="submit"
                disabled={loading || !isDirty}
                className={`h-10 px-6 rounded-xl gap-2 text-sm font-semibold transition-all shadow-sm ${
                  saved
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                    : isDirty
                      ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
                      : "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Salvo!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
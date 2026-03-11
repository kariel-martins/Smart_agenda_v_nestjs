import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save, Globe, Phone, Mail } from "lucide-react";

type BusinessProfile = {
  name: string;
  slug: string | null;
  phone: string | null;
  email: string;
  active?: boolean;
  timezone?: string;
  createdAt?: string;
};

// Mock — na integração real viria de GET /v1/business/profile
const MOCK_PROFILE: BusinessProfile = {
  name: "Barbearia do João",
  slug: "barbearia-joao",
  phone: "(11) 98000-0000",
  email: "contato@barbearia.com",
  active: true,
  timezone: "America/Sao_Paulo",
  createdAt: "2024-01-01T10:00:00Z",
};

export function BusinessProfile() {
  const [form, setForm] = useState<BusinessProfile>(MOCK_PROFILE);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field: keyof BusinessProfile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // PUT /v1/business/profile — body: { name, slug, phone, email }
      await fetch("/v1/business/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, slug: form.slug, phone: form.phone, email: form.email }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />

      <main className="max-w-2xl mx-auto pt-24 pb-12 px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Perfil do Negócio</h1>
            <p className="text-gray-500 text-sm">Gerencie as informações da sua empresa.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Info somente leitura */}
          {form.createdAt && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-500 flex gap-6">
              <span>Criado em: <strong className="text-gray-700">{new Date(form.createdAt).toLocaleDateString("pt-BR")}</strong></span>
              <span>Fuso: <strong className="text-gray-700">{form.timezone}</strong></span>
              <span>Status: <strong className={form.active ? "text-green-600" : "text-red-500"}>{form.active ? "Ativo" : "Inativo"}</strong></span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-gray-400" /> Nome do Negócio
              </Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Nome da empresa"
                className="h-11 bg-gray-50/50 border-gray-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-gray-400" /> Slug (URL)
              </Label>
              <Input
                value={form.slug ?? ""}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="minha-barbearia"
                className="h-11 bg-gray-50/50 border-gray-200"
              />
              <p className="text-xs text-gray-400">Usado na URL pública do agendamento.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" /> Telefone
              </Label>
              <Input
                value={form.phone ?? ""}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(11) 90000-0000"
                className="h-11 bg-gray-50/50 border-gray-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" /> E-mail
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="contato@empresa.com"
                className="h-11 bg-gray-50/50 border-gray-200"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-11 rounded-xl gap-2 shadow-lg transition-all ${
                saved ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
              }`}
            >
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : saved ? "Salvo com sucesso!" : "Salvar Alterações"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
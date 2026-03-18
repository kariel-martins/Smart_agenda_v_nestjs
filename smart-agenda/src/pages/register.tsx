import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { registerMutate } from "@/hooks/auth/auth.mutate";
import { ErrorMessage } from "@/components/ErrorResponce";
import { errorResponce } from "@/Errors/errors";

type RegisterForm = {
  name: string;
  nameBusiness: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function Register() {
  const { mutateAsync: register } = registerMutate();

  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    nameBusiness: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function update(field: keyof RegisterForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
     if (form.password !== form.confirmPassword) return setError({message: "As senhas não coincidem."});

    try {
      setLoading(true);
      await register(form);
      navigate("/cadastro-sucesso")
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const status = error.response?.status;

      if (backendMessage) {
        setError({ message: backendMessage });
      } else {
        setError(errorResponce(status));
      }
       setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4 py-12">
      {error && <ErrorMessage message={error.message} />}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Smart<span className="text-blue-600">Agenda</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Criar conta
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Configure sua empresa e comece a agendar.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Seu nome
              </Label>
              <Input
                type="text"
                placeholder="João Silva"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="h-11 bg-gray-50/50 border-gray-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Nome do negócio
              </Label>
              <Input
                type="text"
                placeholder="Barbearia do João"
                value={form.nameBusiness}
                onChange={(e) => update("nameBusiness", e.target.value)}
                className="h-11 bg-gray-50/50 border-gray-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                E-mail
              </Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="h-11 bg-gray-50/50 border-gray-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="h-11 bg-gray-50/50 border-gray-200 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-700">
                Confirmar senha
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                className="h-11 bg-gray-50/50 border-gray-200"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

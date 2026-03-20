import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginMutate } from "@/hooks/auth/auth.mutate";
import { UseAuth } from "@/contexts/AuthContext";
import { errorResponce } from "@/Errors/errors";
import { ErrorMessage } from "@/components/ErrorResponce";

export function Login() {
  const { login: UserLoginDataInsert } = UseAuth();
  const navigate = useNavigate();
  const { mutateAsync: login } = loginMutate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login(form);
      if (!result) {
        setLoading(false);
        throw new Error("Error ao efetuar o login");
      }
      UserLoginDataInsert({
        name: result.user.name,
        userId: "sdfgsfg",
        businessName: result.BusinessName,
        businessId: result.id,
        role: result.user.userRole,
      });
      navigate("/appointment");
      return result;
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
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4">
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
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Entrar</h1>
          <p className="text-gray-500 text-sm mb-8">
            Acesse o painel da sua empresa.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-11 bg-gray-50/50 border-gray-200 focus-visible:ring-blue-500/30"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Senha
                </Label>
                <Link
                  to="/esqueci-senha"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="h-11 bg-gray-50/50 border-gray-200 pr-10 focus-visible:ring-blue-500/30"
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 gap-2"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

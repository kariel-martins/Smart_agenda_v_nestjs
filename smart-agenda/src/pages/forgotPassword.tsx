import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/auth/auth.mutate";
import { errorResponce } from "@/Errors/errors";
import { ErrorMessage } from "@/components/ErrorResponce";
import { LogIn } from "lucide-react";

export function ForgotPassword() {
  const { mutateAsync: forgotPassword } = useForgotPassword();
  const [form, setForm] = useState({ email: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await forgotPassword(form.email);
      if (!result) {
        setLoading(false);
        throw new Error("Error ao efetuar o login");
      }
      return result;
    } catch (error: any) {
      setError(errorResponce(error.status));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4">
      {error && <ErrorMessage message={error?.message} />}

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
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Esqueceu a senha</h1>
          <p className="text-gray-500 text-sm mb-8">
            Digiter seu email
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

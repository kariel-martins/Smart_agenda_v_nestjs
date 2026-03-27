import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { NavBar } from "@/components/NavBar";
import { CheckCircle, XCircle, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoogleCalendarConnect, useGoogleCalendarStatus } from "@/hooks/google-calendar/google-calendar.mutate";

export function CalendarSettings() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const { mutateAsync: connect } = useGoogleCalendarConnect();

  const connected = params.get("connected");
  const error = params.get("error");

  const { data: calendarStatus, refetch, isLoading } =
    useGoogleCalendarStatus();

  const isSuccess = connected === "true" || calendarStatus?.connected === true;

  // Limpa query params da URL após leitura
  useEffect(() => {
    if (connected || error) {
      const timeout = setTimeout(() => {
        window.history.replaceState(
          {},
          document.title,
          "/settings/calendar"
        );
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [connected, error]);

  // Auto redirect após sucesso (opcional UX)
  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        navigate("/appointment");
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <NavBar />

      <div className="pt-24 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

            {/* Ícone */}
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Integração com Google Calendar
            </h1>

            {/* Mensagem */}
            {isSuccess ? (
              <p className="text-gray-600 mb-6">
                Integração realizada com sucesso. Seus agendamentos já podem ser sincronizados automaticamente.
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                Falha ao conectar com o Google Calendar.
                {error && (
                  <span className="block text-red-500 text-sm mt-2">
                    Motivo: {error}
                  </span>
                )}
              </p>
            )}

            {/* Ações */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => refetch()}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isLoading ? "Atualizando..." : "Atualizar status"}
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/appointment")}
              >
                Voltar para agendamentos
              </Button>

              {!isSuccess && (
                <Button
                  variant="secondary"
                  onClick={() => connect()}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Tentar novamente
                </Button>
              )}
            </div>

            {/* Status */}
            <div className="mt-6 text-sm text-gray-500">
              Status atual:{" "}
              <span className="font-semibold">
                {isLoading
                  ? "Verificando..."
                  : calendarStatus?.connected
                  ? "Conectado"
                  : "Desconectado"}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
import { ShieldOff } from "lucide-react";

export function UnauthorizedOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center px-6">
        <div className="bg-red-100 p-5 rounded-full shadow-sm">
          <ShieldOff className="h-10 w-10 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">
            Sessão expirada
          </h2>
          <p className="text-gray-500 text-sm">
            Sua sessão não é mais válida. Redirecionando para o login...
          </p>
        </div>
        {/* Barra de progresso do redirect */}
        <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-red-400 rounded-full animate-[progress_2s_linear_forwards]" />
        </div>
      </div>
    </div>
  );
}
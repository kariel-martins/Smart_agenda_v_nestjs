import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export function ConfirmAction({ action, onClose, onConfirm }: {
  action: "confirm" | "complete";
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const cfg = {
    confirm:  { title: "Confirmar agendamento?", desc: "O status será atualizado para Confirmado.", color: "bg-green-600 hover:bg-green-700", icon: <CheckCircle className="h-8 w-8 text-green-600" />, bg: "bg-green-100" },
    complete: { title: "Finalizar agendamento?", desc: "O status será atualizado para Finalizado.", color: "bg-gray-700 hover:bg-gray-800", icon: <CheckCircle className="h-8 w-8 text-gray-600" />, bg: "bg-gray-100" },
  }[action];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
        <div className="flex justify-center mb-4">
          <div className={`${cfg.bg} p-4 rounded-full`}>{cfg.icon}</div>
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">{cfg.title}</h2>
        <p className="text-gray-500 text-sm mb-6">{cfg.desc}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl">Cancelar</Button>
          <Button disabled={loading} onClick={async () => { setLoading(true); await onConfirm(); }}
            className={`flex-1 h-11 rounded-xl ${cfg.color}`}>
            {loading ? "Salvando..." : "Confirmar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

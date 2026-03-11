import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState } from "react";

export function CancelModal({ action, onClose, onConfirm }: {
  action: "cancel" | "no_show";
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onConfirm(reason);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            {action === "cancel" ? "Cancelar Agendamento" : "Registrar Não Comparecimento"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-700">Motivo <span className="text-red-500">*</span></Label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={action === "cancel" ? "Ex: Solicitado pelo cliente..." : "Ex: Cliente não compareceu..."}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}
              className={`flex-1 h-11 rounded-xl ${action === "cancel" ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"}`}>
              {loading ? "Salvando..." : action === "cancel" ? "Cancelar agendamento" : "Confirmar falta"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="h-11 rounded-xl px-5">Voltar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
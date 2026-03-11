import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import type { Availabity } from "@/hooks/availability/dtos/availability.dto.type";
import { DAY_LABELS } from "./professionalProfile.const";

export function ConfirmDeleteAvailability({
  availability,
  onClose,
  onConfirm,
}: {
  availability: Availabity;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Remover horário?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Remover <strong>{DAY_LABELS[availability.dayOfWeek]}</strong> das{" "}
          <strong>{availability.startTime}</strong> às <strong>{availability.endTime}</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl">
            Cancelar
          </Button>
          <Button
            disabled={loading}
            onClick={async () => { setLoading(true); await onConfirm(); }}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700 rounded-xl"
          >
            {loading ? "Removendo..." : "Sim, remover"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { CalendarDays, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import type { Availabity } from "@/hooks/availability/dtos/availability.dto.type";
import { DAY_LABELS, DAY_ORDER } from "./professionalProfile.const";


export function AvailabilitiesTab({
  availabilities,
  onNew,
  onDelete,
}: {
  availabilities: Availabity[];
  onNew: () => void;
  onDelete: (a: Availabity) => void;
}) {
  const sorted = [...availabilities].sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {availabilities.length} horário(s) cadastrado(s)
        </p>
        <Button
          onClick={onNew}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl h-9 px-4 gap-2 text-sm shadow-sm shadow-blue-100"
        >
          <Plus className="h-4 w-4" />Adicionar Horário
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="py-16 flex flex-col items-center text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
          <CalendarDays className="h-8 w-8 mb-3 opacity-30" />
          <p className="font-medium text-sm">Nenhum horário cadastrado</p>
          <p className="text-xs mt-1">Defina quando este profissional está disponível.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {sorted.map((avail) => (
              <li
                key={avail.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-xl min-w-[140px]">
                    <span className="text-sm font-bold text-purple-700">
                      {DAY_LABELS[avail.dayOfWeek] ?? avail.dayOfWeek}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-semibold text-gray-800">{avail.startTime}</span>
                    <span className="text-gray-300">–</span>
                    <span className="font-semibold text-gray-800">{avail.endTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(avail)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

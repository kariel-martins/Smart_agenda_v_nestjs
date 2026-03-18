import type { Service } from "@/hooks/services/dtos/service.dtos.type";
import { ChevronRight, Clock, DollarSign, Pencil, Trash2 } from "lucide-react";

export function ServiceCard({ data, onEdit, onDelete }: {
  data: Service;
  onEdit: (s: Service) => void;
  onDelete: (s: Service) => void;
}) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden border border-gray-100">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{data.name}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(data)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => onDelete(data)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4">Criado em {new Date(data.createdAt).toLocaleDateString("pt-BR")}</p>
        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">{data.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-gray-900">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm">R$ {data.price}</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-50 group-hover:bg-blue-600 group-hover:text-white py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 text-gray-500 border-t border-gray-100">
        Agendar <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );
}
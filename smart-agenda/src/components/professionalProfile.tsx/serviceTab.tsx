import { ChevronRight, Clock, DollarSign, Pencil, Plus, Scissors, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import type { Service } from "@/hooks/services/dtos/service.dtos.type";
import type { ServiceProfData } from "@/hooks/professionals/dtos/professional.types";

export function ServicesTab({
  services,
  onEdit,
  onDelete,
  onNew,
}: {
  services: ServiceProfData[]
  onEdit: (s: Service) => void;
  onDelete: (s: Service) => void;
  onNew: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {services.length} {services.length === 1 ? "serviço" : "serviços"} cadastrado(s)
        </p>
        <Button
          onClick={onNew}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl h-9 px-4 gap-2 text-sm shadow-sm shadow-blue-100"
        >
          <Plus className="h-4 w-4" />Novo Serviço
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="py-16 flex flex-col items-center text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
          <Scissors className="h-8 w-8 mb-3 opacity-30" />
          <p className="font-medium text-sm">Nenhum serviço cadastrado</p>
          <p className="text-xs mt-1">Adicione serviços para este profissional.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.service.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden border border-gray-100"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {s.service.name}
                  </h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(s.service)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(s.service)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Criado em {new Date(s.service.createdAt).toLocaleDateString("pt-BR")}
                </p>
                <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium">{s.service.durationMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-gray-900">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm">R$ {s.service.price}</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-50 group-hover:bg-blue-600 group-hover:text-white py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 text-gray-500 border-t border-gray-100">
                Agendar <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          ))}

          <button
            onClick={onNew}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group min-h-[150px]"
          >
            <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">Adicionar serviço</span>
          </button>
        </div>
      )}
    </div>
  );
}
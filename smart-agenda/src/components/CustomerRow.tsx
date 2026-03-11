import { Mail, Phone, MoreHorizontal, User, History, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  businessId: string;
  noShowCount: number | null;
  totalAppointments: number | null;
};

export function CustomerRow({ data }: { data: Customer }) {
  const noShowCount = data.noShowCount ?? 0;
  const totalAppointments = data.totalAppointments ?? 0;
  const isRisky = noShowCount >= 2;

  return (
    <tr className="group hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-none">
      {/* Cliente */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shrink-0">
            {data.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-none">{data.name}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Mail className="h-3 w-3" /> {data.email}
            </p>
          </div>
        </div>
      </td>

      {/* Telefone */}
      <td className="py-4 px-4 hidden md:table-cell text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-gray-400" />
          {data.phone}
        </div>
      </td>

      {/* Total de Agendamentos */}
      <td className="py-4 px-4 hidden lg:table-cell">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">{totalAppointments}</span>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Agendamentos</span>
        </div>
      </td>

      {/* No-Show */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5">
          {isRisky && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
          <span className={`text-sm font-semibold ${isRisky ? "text-red-600" : "text-gray-700"}`}>
            {noShowCount}
          </span>
          <span className="text-xs text-gray-400">faltas</span>
        </div>
      </td>

      {/* Status / Badge de risco */}
      <td className="py-4 px-4">
        {isRisky ? (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Risco
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Regular
          </Badge>
        )}
      </td>

      {/* Ações */}
      <td className="py-4 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" /> Ver Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <History className="h-4 w-4" /> Histórico
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-red-600">Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
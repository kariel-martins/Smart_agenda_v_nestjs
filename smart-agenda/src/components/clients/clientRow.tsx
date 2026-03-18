import { AlertTriangle, Mail, MoreHorizontal, Pencil, Phone, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { Client, ClientWithAppointment } from "@/hooks/clients/dtos/client.dto.type";

export function ClientRow({
  data,
  onEdit,
  onDelete,
}: {
  data: ClientWithAppointment;
  onEdit: (c: Client) => void;
  onDelete: (c: Client) => void;
}) {

  const appointments = data.appointments ?? []

  const noShowCount = appointments.filter((a) => a.status === "no_show").length
  const totalAppointments = appointments.length
  const isRisky = noShowCount >= 2; // TODO - será posto as regras de no show

  return (
    <tr className="group hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-none">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shrink-0">
            {data.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-none">{data.name}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {data.email}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 hidden md:table-cell text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-gray-400" />
          {data.phone}
        </div>
      </td>
      <td className="py-4 px-4 hidden lg:table-cell">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">
            {totalAppointments}
          </span>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
            Agendamentos
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5">
          {isRisky && <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
          <span
            className={`text-sm font-semibold ${isRisky ? "text-red-600" : "text-gray-700"}`}
          >
            {noShowCount}
          </span>
          <span className="text-xs text-gray-400">faltas</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <Badge
          variant="outline"
          className={
            isRisky
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-green-50 text-green-700 border-green-200"
          }
        >
          {isRisky ? "Risco" : "Regular"}
        </Badge>
      </td>
      <td className="py-4 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-blue-600"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2" onClick={() => onEdit(data)}>
              <Pencil className="h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 text-red-600"
              onClick={() => onDelete(data)}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
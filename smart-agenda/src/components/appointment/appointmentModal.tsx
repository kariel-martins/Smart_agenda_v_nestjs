import { Save, X, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

import { useState } from "react";
import type { AppointmentForm } from "@/hooks/appointment/dtos/appointment.dto.types";
import {
  useProfessionalFindAll,
  UseProfessionalFindById,
} from "@/hooks/professionals/professional.mutate";
import { useClientFindAll } from "@/hooks/clients/client.mutate";

export function AppointmentModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (form: AppointmentForm) => Promise<void>;
}) {
  const [form, setForm] = useState<AppointmentForm>({
    date: "",
    startTime: "",
    endTime: "",
    professionalId: "",
    clientId: "",
    serviceId: "",
  });

  const [loading, setLoading] = useState(false);

  const [openClient, setOpenClient] = useState(false);
  const [openProfessional, setOpenProfessional] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [professionalId, setProfessionalid] = useState(0);

  const { data: professionalData } = useProfessionalFindAll();
  const { data: clientData } = useClientFindAll();

  const { data: findProfessionalById } =
    UseProfessionalFindById(professionalId);

  const professional = Array.isArray(professionalData?.data)
    ? professionalData.data
    : [];
  const client = Array.isArray(clientData?.data) ? clientData.data : [];
  const services = Array.isArray(findProfessionalById?.service) ? findProfessionalById.service : []

  async function handleSelectProfessional(id: number) {
    setProfessionalid(id);
    setForm((p) => ({ ...p, professionalId: String(id)}));
  }

  async function handleSelectService(id: number) {
    setForm((s) => ({ ...s, serviceId: String(id) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">
            Novo Agendamento
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* DATA */}

          <div className="space-y-1.5">
            <Label>Data *</Label>

            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              required
            />
          </div>

          {/* HORAS */}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Hora início *</Label>

              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((p) => ({ ...p, startTime: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Hora fim *</Label>

              <Input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((p) => ({ ...p, endTime: e.target.value }))
                }
                required
              />
            </div>
          </div>

          {/* CLIENTE */}

          <div className="space-y-2">
            <Label>Cliente *</Label>

            <Popover open={openClient} onOpenChange={setOpenClient}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {form.clientId
                    ? client.find((c) => c.id === form.clientId)?.name
                    : "Selecionar cliente"}

                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar cliente..." />

                  <CommandEmpty>Nenhum cliente</CommandEmpty>

                  <CommandGroup>
                    {client.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={c.name}
                        onSelect={() => {
                          setForm((p) => ({ ...p, clientId: c.id }));
                          setOpenClient(false);
                        }}
                      >
                        {c.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* PROFISSIONAL */}

          <div className="space-y-2">
            <Label>Profissional *</Label>

            <Popover open={openProfessional} onOpenChange={setOpenProfessional}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.professionalId
                    ? professional.find(
                        (p) => p.id === Number(form.professionalId),
                      )?.name
                    : "Selecionar profissional"}

                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar profissional..." />

                  <CommandEmpty>Nenhum profissional</CommandEmpty>

                  <CommandGroup>
                    {professional.map(
                      (p) => (
                        <CommandItem
                          key={p.id}
                          value={p.name}
                          onSelect={() => {
                            handleSelectProfessional(p.id);
                            setOpenProfessional(false);
                          }}
                        >
                          {p.name}
                        </CommandItem>
                      ),
                    )}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* SERVIÇO */}

          <div className="space-y-2">
            <Label>Serviço *</Label>

            <Popover open={openService} onOpenChange={setOpenService}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {services.find((s) => s.service.id === Number(form.serviceId))?.service.name
                    ?? "Selecionar serviço"}

                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder="Buscar serviço..." />

                  <CommandEmpty>Nenhum serviço</CommandEmpty>

                  <CommandGroup>
                    {services.map((s) => (
                      <CommandItem
                        key={s.service.id}
                        value={s.service.name}
                        onSelect={() => {
                           handleSelectService(s.service.id);
                          setOpenService(false);
                        }}
                      >
                        {s.service.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* BOTÕES */}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 rounded-xl gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Agendando..." : "Criar agendamento"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-xl px-5"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import type { NoShowAction } from "@/hooks/noShowRules/dtos/noShowRules.dto.type";
import { ACTION_OPTIONS } from "./noShowRule.const";


export function getAction(value: NoShowAction) {
  return ACTION_OPTIONS.find((a) => a.value === value)!;
}

export function ActionSelect({
  value,
  onChange,
}: {
  value: NoShowAction;
  onChange: (v: NoShowAction) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {ACTION_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
              active
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20"
                : "border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300"
            }`}
          >
            <span
              className={`p-2 rounded-lg ${
                active ? "bg-blue-100 text-blue-600" : "bg-white text-gray-400 border border-gray-200"
              }`}
            >
              {opt.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${active ? "text-blue-700" : "text-gray-700"}`}>
                {opt.label}
              </p>
              <p className="text-xs text-gray-400 truncate">{opt.description}</p>
            </div>
            <span
              className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${
                active ? "border-blue-500 bg-blue-500" : "border-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

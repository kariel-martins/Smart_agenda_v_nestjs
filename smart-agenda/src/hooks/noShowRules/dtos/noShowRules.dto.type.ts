export type NoShowAction = "block_booking" | "require_deposit" | "manual_approval"

export interface NoShowRequest {
    maxRatePercent: number
    action: NoShowAction

}


export type ActionOption = {
  value: NoShowAction;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badgeClass: string;
};

export interface UpdateNoShowRequest {
    id: number
    maxRatePercent?: number
    action?: NoShowAction

}

export interface NoShowRuleData {
  createdAt: Date
  id: number
  businessId: string | null
  maxRatePercent: number | null
  action: NoShowAction
}

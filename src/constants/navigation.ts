import {
  Database,
  CirclePlus,
  BookOpen,
  LayoutDashboard,
} from "lucide-react"

export type DashboardTab = "dashboard" | "activity-data" | "data-input" | "methodology"

export const DASHBOARD_TABS = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: LayoutDashboard,
  },
  {
    id: "activity-data",
    label: "활동 데이터",
    icon: Database,
  },
  {
    id: "data-input",
    label: "데이터 입력",
    icon: CirclePlus,
  },
  {
    id: "methodology",
    label: "계산 기준",
    icon: BookOpen,
  },
] as const
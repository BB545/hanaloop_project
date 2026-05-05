import {
  Database,
  BookOpen,
  LayoutDashboard,
} from "lucide-react"

export type DashboardTab = "dashboard" | "activity-data" | "methodology"

export const DASHBOARD_TABS = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: LayoutDashboard,
  },
  {
    id: "activity-data",
    label: "데이터 관리",
    icon: Database,
  },
  {
    id: "methodology",
    label: "계산 기준",
    icon: BookOpen,
  },
] as const
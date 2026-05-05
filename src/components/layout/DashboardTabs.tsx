"use client"

import { DASHBOARD_TABS, type DashboardTab } from "@/constants/navigation"

type DashboardTabsProps = {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <nav className="mt-4 flex flex-wrap gap-2" aria-label="대시보드 메뉴">
      {DASHBOARD_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={[
              "flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition cursor-pointer",
              isActive
                ? "bg-slate-200 text-slate-900"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            <Icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default DashboardTabs
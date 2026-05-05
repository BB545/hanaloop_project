import type { ActivityRecord, FilterState } from "@/types/carbon"
import DashboardFilter from "../filters/DashboardFilter"
import DashboardKPI from "./DashboardKPI"
import DashboardChart from "./DashboardChart"

type DashboardOverviewProps = {
  filters: FilterState
  descriptions: string[]
  filteredRecords: ActivityRecord[]
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
}

const DashboardOverview = ({
    filters,
    descriptions,
    filteredRecords,
    onFiltersChange,
    onReset,
}: DashboardOverviewProps) => {
    return (
        <section>
            <DashboardFilter
                filters={filters}
                descriptions={descriptions}
                onFiltersChange={onFiltersChange}
                onReset={onReset}
            />

            <div className="rounded-xl border bg-white p-6 mt-1">
                <p className="text-sm text-slate-500">
                    현재 조건 결과: {filteredRecords.length}건
                </p>
            </div>

            <DashboardKPI filteredCount={filteredRecords.length} />
            <DashboardChart />
        </section>
    )
}

export default DashboardOverview
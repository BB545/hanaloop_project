import type { ActivityRecord, EmissionByActivityType, EmissionByDescription, FilterState, MonthlyEmission } from "@/types/carbon"
import DashboardFilter from "../filters/DashboardFilter"
import DashboardKPI from "./DashboardKPI"
import DashboardChart from "./DashboardChart"
import { DashboardSummary, DataQualitySummary } from "@/lib/caculate"

type DashboardOverviewProps = {
    filters: FilterState
    descriptions: string[]
    filteredRecords: ActivityRecord[]
    onFiltersChange: (filters: FilterState) => void
    onReset: () => void
    summary: DashboardSummary
    monthlyEmissions: MonthlyEmission[]
    emissionsByActivityType: EmissionByActivityType[]
    emissionsByDescription: EmissionByDescription[]
    dataQuality: DataQualitySummary
}

const DashboardOverview = ({
    filters,
    descriptions,
    filteredRecords,
    onFiltersChange,
    onReset,
    summary,
    monthlyEmissions,
    emissionsByActivityType,
    emissionsByDescription,
    dataQuality,
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

            <DashboardKPI
                filteredCount={filteredRecords.length}
                summary={summary}
            />
            <DashboardChart
                monthlyEmissions={monthlyEmissions}
                emissionsByActivityType={emissionsByActivityType}
                emissionsByDescription={emissionsByDescription}
                dataQuality={dataQuality}
            />
        </section>
    )
}

export default DashboardOverview
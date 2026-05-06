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
    onMoveToActivityData: () => void
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
    onMoveToActivityData,
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
                    현재 조건 결과: <span className="font-semibold">{filteredRecords.length}건</span> (조건 미적용 시 최근 12개월 기준)
                </p>
                <p className="mt-2 text-sm text-indigo-700">
                    상세 데이터는 {" "}
                    <button
                        type="button"
                        onClick={onMoveToActivityData}
                        className="cursor-pointer underline underline-offset-4 transition-colors hover:text-indigo-900"
                    >
                        [데이터 관리]
                    </button>
                    {" "} 탭에서 확인할 수 있습니다.
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
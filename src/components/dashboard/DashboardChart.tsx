import { EmissionByActivityType, EmissionByDescription, MonthlyEmission } from "@/types/carbon"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DataQualitySummary } from "@/lib/caculate"
import MonthlyEmissionChart from "./charts/MonthlyEmissionChart"
import ActivityTypePieChart from "./charts/ActivityTypePieChart"
import DescriptionRankingChart from "./charts/DescriptionRankingChart"
import { formatNumber } from "@/lib/format"

type DashboardChartProps = {
  monthlyEmissions: MonthlyEmission[]
  emissionsByActivityType: EmissionByActivityType[]
  emissionsByDescription: EmissionByDescription[]
  dataQuality: DataQualitySummary
}


const DashboardChart = ({
  monthlyEmissions,
  emissionsByActivityType,
  emissionsByDescription,
  dataQuality,
}: DashboardChartProps) => {
  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[2fr_1fr] mt-5">
      <Card className="min-h-[360px] min-w-0">
        <CardHeader>
          <CardTitle className="text-base">월별 배출량 추이</CardTitle>
          <p className="text-sm text-slate-500">
            월별 PCF 배출량 변화를 표시합니다.
          </p>
        </CardHeader>

        <CardContent className="flex min-h-0 min-w-0 flex-1 items-end">
          <MonthlyEmissionChart data={monthlyEmissions} />
        </CardContent>
      </Card>

      <Card className="min-h-[360px] min-w-0">
        <CardHeader>
          <CardTitle className="text-base">활동 유형별 배출 비중</CardTitle>
          <p className="text-sm text-slate-500">
            전기, 원소재, 운송 기준 배출량 비중을 표시합니다.
          </p>
        </CardHeader>

        <CardContent className="min-w-0 min-h-0">
          <ActivityTypePieChart data={emissionsByActivityType} />
        </CardContent>
      </Card>

      <Card className="min-h-[320px] min-w-0">
        <CardHeader>
          <CardTitle className="text-base">항목별 배출량 순위</CardTitle>
          <p className="text-sm text-slate-500">
            세부 항목별 누적 배출량을 비교합니다.
          </p>
        </CardHeader>

        <CardContent className="flex min-w-0 min-h-0 flex-1 items-end">
          <DescriptionRankingChart data={emissionsByDescription} />
        </CardContent>
      </Card>

      <Card className="min-h-[320px] min-w-0">
        <CardHeader>
          <CardTitle className="text-base">데이터 품질 요약</CardTitle>
          <p className="text-sm text-slate-500">
            데이터 건수, 검증 상태, 배출계수 매칭률을 표시합니다.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">총 데이터</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {dataQuality.totalCount}건
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">검증 완료</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {dataQuality.validCount}건
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">오류 데이터</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {dataQuality.errorCount}건
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">배출계수 매칭률</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {formatNumber(dataQuality.matchingRate)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardChart
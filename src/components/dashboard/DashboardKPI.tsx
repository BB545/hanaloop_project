import KPICard from "./KPICard"
import { DashboardSummary } from "@/lib/caculate"
import { formatEmission, formatPercent } from "@/lib/format"

type DashboardKPIProps = {
  filteredCount: number
  summary: DashboardSummary
}

const DashboardKPI = ({
  filteredCount,
  summary,
}: DashboardKPIProps) => {
  const monthlyChangeColor =
    summary.monthlyChangeRate > 0
      ? "text-red-600"
      : summary.monthlyChangeRate < 0
        ? "text-blue-600"
        : "text-slate-950"

  const getActivityTypeColorByLabel = (label?: string) => {
    switch (label) {
      case "전기 사용":
        return "text-amber-300"
      case "원소재":
      case "원자재":
        return "text-lime-700"
      case "운송":
        return "text-slate-800"
      default:
        return "text-slate-950"
    }
  }

  const kpis = [
    {
      title: "총 배출량",
      value: formatEmission(summary.totalEmissions),
      description: `현재 조건에 해당하는 활동 데이터 ${filteredCount}건 기준`,
      valueClassName: "text-slate-950",
    },
    {
      title: "전월 대비 증감률",
      value: formatPercent(summary.monthlyChangeRate),
      description: "최근 월과 직전 월 배출량 비교",
      valueClassName: monthlyChangeColor,
    },
    {
      title: "최대 배출 활동 유형",
      value: summary.topActivityType?.label ?? "-",
      description: summary.topActivityType
        ? `전체의 ${formatPercent(summary.topActivityType.percentage).replace("+", "")}`
        : "계산 가능한 데이터가 없습니다",
      valueClassName: getActivityTypeColorByLabel(summary.topActivityType?.label),
    },
    {
      title: "최대 배출 항목",
      value: summary.topDescription?.description ?? "-",
      description: summary.topDescription
        ? formatEmission(summary.topDescription.emissions)
        : "계산 가능한 데이터가 없습니다",
      valueClassName: "text-slate-950",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-5">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          description={kpi.description}
          valueClassName={kpi.valueClassName}
        />
      ))}
    </div>
  )
}

export default DashboardKPI
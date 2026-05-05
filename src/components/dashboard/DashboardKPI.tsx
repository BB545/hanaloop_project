import { Activity, BarChart3, Factory, Target } from "lucide-react"
import KPICard from "./KPICard"

type DashboardMetricGridProps = {
  filteredCount: number
}

const DashboardKPI = ({ filteredCount }: DashboardMetricGridProps) => {
    const metrics = [
    {
      title: "총 배출량",
      value: "- kgCO2e",
      description: `현재 조건에 해당하는 활동 데이터 ${filteredCount}건 기준`,
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "전월 대비 증감률",
      value: "- %",
      description: "최근 월과 직전 월 배출량 비교",
      icon: <Activity className="h-5 w-5" />,
    },
    {
      title: "최대 배출 활동 유형",
      value: "-",
      description: "전기·원소재·운송 중 최대 배출 유형",
      icon: <Factory className="h-5 w-5" />,
    },
    {
      title: "최대 배출 항목",
      value: "-",
      description: "감축 우선순위가 높은 세부 항목",
      icon: <Target className="h-5 w-5" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-5">
      {metrics.map((metric) => (
        <KPICard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description={metric.description}
          icon={metric.icon}
        />
      ))}
    </div>
  )
}

export default DashboardKPI
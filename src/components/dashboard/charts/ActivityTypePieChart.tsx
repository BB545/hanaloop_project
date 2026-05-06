"use client"

import { formatEmission, formatNumber } from "@/lib/format"
import { ACTIVITY_TYPE_LABELS, type ActivityType, type EmissionByActivityType } from "@/types/carbon"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

type ActivityTypePieChartProps = {
    data: EmissionByActivityType[]
}

const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
    electricity: "#fcd34d",
    raw_material: "#65a30d",
    transportation: "#1e293b",
}

const ActivityTypePieChart = ({ data }: ActivityTypePieChartProps) => {
    if (data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                표시할 활동 유형별 데이터가 없습니다.
            </div>
        )
    }

    const chartData = data.map((item) => ({
        ...item,
        label: ACTIVITY_TYPE_LABELS[item.activityType],
        fill: ACTIVITY_TYPE_COLORS[item.activityType],
    }))

    return (
        <div className="space-y-4">
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip formatter={(value) => formatEmission(Number(value))} />
                        <Pie
                            data={chartData}
                            dataKey="emissions"
                            nameKey="label"
                            innerRadius={48}
                            outerRadius={78}
                            paddingAngle={3}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-2">
                {chartData.map((item) => (
                    <div
                        key={item.activityType}
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className="h-3 w-3 rounded-full"
                                style={{
                                    backgroundColor: item.fill,
                                }}
                            />
                            <span className="text-sm font-medium text-slate-700">
                                {item.label}
                            </span>
                        </div>

                        <span className="text-sm text-slate-500">
                            {formatEmission(item.emissions)} | {formatNumber(item.percentage)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActivityTypePieChart
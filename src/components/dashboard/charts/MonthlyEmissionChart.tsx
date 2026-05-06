"use client"

import { formatEmission } from "@/lib/format"
import type { MonthlyEmission } from "@/types/carbon"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type MonthlyEmissionChartProps = {
    data: MonthlyEmission[]
}

const MonthlyEmissionChart = ({ data }: MonthlyEmissionChartProps) => {
    if (data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                표시할 월별 배출량 데이터가 없습니다.
            </div>
        )
    }

    return (
        <div className="h-80 min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${Number(value).toLocaleString()}`}
                    />
                    <Tooltip
                        formatter={(value) => [formatEmission(Number(value)), "배출량"]}
                        labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="emissions" fill="#5b7599" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MonthlyEmissionChart
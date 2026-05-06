"use client"

import { formatEmission } from "@/lib/format"
import type { EmissionByDescription } from "@/types/carbon"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type DescriptionRankingChartProps = {
    data: EmissionByDescription[]
}

const DescriptionRankingChart = ({ data }: DescriptionRankingChartProps) => {
    if (data.length === 0) {
        return (
            <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                표시할 항목별 배출량 데이터가 없습니다.
            </div>
        )
    }

    return (
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 24, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        type="category"
                        dataKey="description"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        width={80}
                    />
                    <Tooltip formatter={(value) => [formatEmission(Number(value)), "배출량"]} />
                    <Bar dataKey="emissions" fill="#3d4d63" radius={[0, 6, 6, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DescriptionRankingChart
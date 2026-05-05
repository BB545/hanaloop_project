"use client"

import { ACTIVITY_TYPE_LABELS, type ActivityType, type FilterState } from "@/types/carbon"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Filter, RotateCcw } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

type DashboardFilterProps = {
    filters: FilterState
    descriptions: string[]
    onFiltersChange: (filters: FilterState) => void
    onReset: () => void
}

const DashboardFilter = ({
    filters,
    descriptions,
    onFiltersChange,
    onReset,
}: DashboardFilterProps) => {
    const handleStartDateChange = (start: string) => {
        onFiltersChange({
            ...filters,
            dateRange: {
                start,
                end: filters.dateRange?.end ?? '',
            },
        })
    }

    const handleEndDateChange = (end: string) => {
        onFiltersChange({
            ...filters,
            dateRange: {
                start: filters.dateRange?.start ?? '',
                end,
            },
        })
    }

    const handleActivityTypeChange = (value: ActivityType | 'all') => {
        onFiltersChange({
            ...filters,
            activityType: value,
            description: 'all',
        })
    }

    const handleDescriptionChange = (value: string) => {
        onFiltersChange({
            ...filters,
            description: value,
        })
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        분석 조건
                    </CardTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        className="group cursor-pointer xl:h-10 text-slate-500 hover:bg-transparent hover:text-slate-900"
                        onClick={onReset}
                    >
                        <RotateCcw className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-rotate-45" />
                        필터 초기화
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto] xl:items-end">
                    <div className="space-y-2">
                        <Label htmlFor="start-date">시작일</Label>
                        <Input
                            id="start-date"
                            type="date"
                            value={filters.dateRange?.start ?? ''}
                            onChange={(event) => handleStartDateChange(event.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="end-date">종료일</Label>
                        <Input
                            id="end-date"
                            type="date"
                            value={filters.dateRange?.end ?? ''}
                            onChange={(event) => handleEndDateChange(event.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>활동 유형</Label>
                        <Select
                            value={filters.activityType}
                            onValueChange={(value) =>
                                handleActivityTypeChange(value as ActivityType | 'all')
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="활동 유형 선택" />
                            </SelectTrigger>
                            <SelectContent
                                position="popper"
                            >
                                <SelectItem value="all">전체 유형</SelectItem>
                                <SelectItem value="electricity">
                                    {ACTIVITY_TYPE_LABELS.electricity}
                                </SelectItem>
                                <SelectItem value="raw_material">
                                    {ACTIVITY_TYPE_LABELS.raw_material}
                                </SelectItem>
                                <SelectItem value="transportation">
                                    {ACTIVITY_TYPE_LABELS.transportation}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>항목</Label>
                        <Select
                            value={filters.description}
                            onValueChange={handleDescriptionChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="항목 선택" />
                            </SelectTrigger>
                            <SelectContent
                                position="popper"
                            >
                                <SelectItem value="all">전체 항목</SelectItem>
                                {descriptions.map((description) => (
                                    <SelectItem key={description} value={description}>
                                        {description}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DashboardFilter
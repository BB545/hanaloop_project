import { ACTIVITY_TYPE_LABELS, ActivityType, CalculatedActivityRecord } from "@/types/carbon"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { formatEmission, formatNumber } from "@/lib/format"

type ActivityDataTableProps = {
    records: CalculatedActivityRecord[]
}

const getActivityBadgeClassName = (activityType: ActivityType) => {
    switch (activityType) {
        case "electricity":
            return "bg-amber-300/70 text-black hover:bg-amber-300/70"
        case "raw_material":
            return "bg-lime-700/70 text-white hover:bg-lime-700/70"
        case "transportation":
            return "bg-slate-800/70 text-white hover:bg-slate-800/70"
        default:
            return "bg-slate-100 text-slate-700 hover:bg-slate-100"
    }
}

const formatDate = (date: string) => {
    return date.replaceAll("-", ". ")
}

const ActivityDataTable = ({
    records,
}: ActivityDataTableProps) => {
    const sortedRecords = [...records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-base">활동 데이터</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                            현재 필터 조건에 해당하는 데이터 {records.length}건
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="mt-3">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-100 hover:bg-slate-100">
                                <TableHead className="min-w-[120px]">날짜</TableHead>
                                <TableHead className="min-w-[120px]">활동 유형</TableHead>
                                <TableHead className="min-w-[160px]">항목명</TableHead>
                                <TableHead className="min-w-[100px] text-right">수량</TableHead>
                                <TableHead className="min-w-[80px]">단위</TableHead>
                                <TableHead className="min-w-[120px] text-right">
                                    배출계수
                                </TableHead>
                                <TableHead className="min-w-[150px] text-right">
                                    배출량 (kgCO2e)
                                </TableHead>
                                <TableHead className="min-w-[100px] text-center">
                                    관리
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {sortedRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                                            현재 필터 조건에 해당하는 활동 데이터가 없습니다.
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">
                                            {formatDate(record.date)}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                className={getActivityBadgeClassName(
                                                    record.activityType
                                                )}
                                            >
                                                {ACTIVITY_TYPE_LABELS[record.activityType]}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{record.description}</TableCell>

                                        <TableCell className="text-right font-medium">
                                            {formatNumber(record.amount)}
                                        </TableCell>

                                        <TableCell>{record.unit}</TableCell>

                                        <TableCell className="text-right">
                                            {formatNumber(record.emissionFactor)}
                                        </TableCell>

                                        <TableCell className="text-right font-semibold">
                                            {formatEmission(record.emissionsKgCO2e)}
                                        </TableCell>

                                        <TableCell className="text-center text-sm text-slate-400">
                                            -
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default ActivityDataTable
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

type ActivityDataTableProps = {
    filteredCount: number
}

const ActivityDataTable = ({
    filteredCount,
}: ActivityDataTableProps) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="text-base">활동 데이터</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">
                            현재 필터 조건에 해당하는 데이터 {filteredCount}건
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
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">2026. 5. 1.</TableCell>
                                <TableCell>
                                    <Badge className="bg-amber-300/70 text-black hover:bg-amber-300/70">
                                        전기
                                    </Badge>
                                </TableCell>
                                <TableCell>한국전력</TableCell>
                                <TableCell className="text-right font-medium">
                                    3,050
                                </TableCell>
                                <TableCell>kWh</TableCell>
                                <TableCell className="text-right">0.456</TableCell>
                                <TableCell className="text-right font-semibold">
                                    1,390.8
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-medium">2026. 4. 28.</TableCell>
                                <TableCell>
                                    <Badge className="bg-lime-700/70 text-white hover:bg-lime-700/70">원자재</Badge>
                                </TableCell>
                                <TableCell>플라스틱 2</TableCell>
                                <TableCell className="text-right font-medium">180</TableCell>
                                <TableCell>kg</TableCell>
                                <TableCell className="text-right">3.2</TableCell>
                                <TableCell className="text-right font-semibold">576</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className="font-medium">2026. 4. 16.</TableCell>
                                <TableCell>
                                    <Badge className="bg-slate-800/70 text-white hover:bg-slate-800/70">
                                        운송
                                    </Badge>
                                </TableCell>
                                <TableCell>트럭</TableCell>
                                <TableCell className="text-right font-medium">310</TableCell>
                                <TableCell>ton-km</TableCell>
                                <TableCell className="text-right">3.5</TableCell>
                                <TableCell className="text-right font-semibold">1,085</TableCell>
                                <TableCell className="text-center text-sm text-slate-400">
                                    -
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={7}>
                                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                                        실제 활동 데이터 목록은 후속 기능 구현 단계에서 연결됩니다.
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default ActivityDataTable
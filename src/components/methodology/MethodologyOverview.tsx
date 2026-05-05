import { EMISSION_FACTORS } from "@/data/emissionFactors"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"


const MethodologyOverview = () => {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">PCF 계산 방식</CardTitle>
            <p className="text-sm text-slate-500">
              활동 데이터에 해당 활동의 배출계수를 곱해 kgCO2e 단위의 배출량을 산정합니다.
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="rounded-xl bg-slate-200 p-4">
              <p className="text-sm font-medium text-slate-500">기본 계산식</p>
              <p className="mt-3 text-base text-slate-950 bg-white px-4 py-2 rounded-md">
                배출량 (kgCO2e) = 활동량 × 배출계수
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border bg-white p-4">
                <p className="text-sm font-medium text-slate-700">전기</p>
                <p className="mt-2 text-sm text-slate-500">
                  kWh 단위 사용량에 전력 배출계수를 적용합니다.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4">
                <p className="text-sm font-medium text-slate-700">원자재</p>
                <p className="mt-2 text-sm text-slate-500">
                  kg 단위 원자재 사용량에 소재별 배출계수를 적용합니다.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4">
                <p className="text-sm font-medium text-slate-700">운송</p>
                <p className="mt-2 text-sm text-slate-500">
                  ton-km 단위 운송 활동량에 운송 배출계수를 적용합니다.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5">
              <p className="text-sm font-medium text-slate-700">계산 예시</p>
              <p className="mt-2 text-sm text-slate-500">
                한국전력 전기 사용량이 110 kWh이고 배출계수가 0.456 kgCO2e/kWh라면,
              </p>
              <p className="mt-3 text-base text-slate-950 bg-slate-100 px-4 py-2 rounded-md">
                110 × 0.456 = 50.16 kgCO2e
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">적용 단위</CardTitle>
            <p className="text-sm text-slate-500">
              활동 유형별로 입력 가능한 단위를 고정해 계산 오류를 줄입니다.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-amber-500/10 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">전기</span>
              <Badge className="bg-amber-300/70 text-black hover:bg-amber-300/70">
                kWh
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-lime-500/10 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">원자재</span>
              <Badge className="bg-lime-700/70 text-white hover:bg-lime-700/70">
                kg
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-500/10 px-4 py-3">
              <span className="text-sm font-medium text-slate-700">운송</span>
              <Badge className="bg-slate-800/70 text-white hover:bg-slate-800/70">
                ton-km
              </Badge>
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 p-4">
              <p className="text-sm text-slate-500">
                데이터 입력 시 활동 유형을 선택하면 단위를 자동으로 표시하고,
                단위 불일치나 배출계수 미매칭을 검증할 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">배출계수 테이블</CardTitle>
          <p className="text-sm text-slate-500">
            활동 데이터와 배출계수를 분리하여 관리하고, 향후 배출계수 변경 시 재계산과 버전 추적이 가능합니다.
          </p>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="min-w-[120px]">활동 유형</TableHead>
                  <TableHead className="min-w-[160px]">항목명</TableHead>
                  <TableHead className="min-w-[120px] text-right">
                    배출계수
                  </TableHead>
                  <TableHead className="min-w-[140px]">활동 단위</TableHead>
                  <TableHead className="min-w-[160px]">계수 단위</TableHead>
                  <TableHead className="min-w-[120px]">버전</TableHead>
                  <TableHead className="min-w-[140px]">적용 시작일</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {EMISSION_FACTORS.map((factor) => (
                  <TableRow key={factor.id}>
                    <TableCell>
                      {factor.activityType === "electricity" && (
                        <Badge className="bg-amber-300/70 text-black hover:bg-amber-300/70">
                          전기
                        </Badge>
                      )}

                      {factor.activityType === "raw_material" && (
                        <Badge className="bg-lime-700/70 text-white hover:bg-lime-700/70">
                          원자재
                        </Badge>
                      )}

                      {factor.activityType === "transportation" && (
                        <Badge className="bg-slate-800/70 text-white hover:bg-slate-800/70">
                          운송
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {factor.description}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {factor.factor}
                    </TableCell>
                    <TableCell>{factor.activityUnit}</TableCell>
                    <TableCell>{factor.factorUnit}</TableCell>
                    <TableCell>{factor.version}</TableCell>
                    <TableCell>{factor.effectiveFrom}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">배출계수 버전 관리 기준</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                version
              </p>
              <p className="mt-1 text-sm text-slate-500">
                적용된 배출계수의 버전을 기록해 재계산 기준을 추적합니다.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                effectiveFrom / effectiveTo
              </p>
              <p className="mt-1 text-sm text-slate-500">
                배출계수의 적용 시작일과 종료일을 관리해 특정 기간에 어떤 계수가 적용되었는지 확인합니다.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                factorUnit
              </p>
              <p className="mt-1 text-sm text-slate-500">
                kgCO2e/kWh, kgCO2e/kg, kgCO2e/ton-km처럼 계수 단위를 명확히 표시합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">데이터 구조 설계</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-xl border border-dashed border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">
                활동 데이터
              </p>
              <p className="mt-1 text-sm text-slate-500">
                사용자가 입력하는 일자, 활동 유형, 항목, 수량, 단위 정보를 원본 데이터로 보존합니다.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">
                배출계수 데이터
              </p>
              <p className="mt-1 text-sm text-slate-500">
                항목별 배출계수와 단위, 버전 정보를 별도로 관리해 계수 변경에 대응할 수 있습니다.
              </p>
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">
                계산 결과 데이터
              </p>
              <p className="mt-1 text-sm text-slate-500">
                원본 활동 데이터에 배출계수를 매칭한 뒤 계산된 kgCO2e 값을 별도로 생성해 대시보드와 테이블에서 재사용합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default MethodologyOverview
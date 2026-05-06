import { PlusCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_UNITS, ActivityRecord, ActivityType } from "@/types/carbon"
import { EMISSION_FACTORS } from "@/data/emissionFactors"
import { useMemo, useState } from "react"

type ActivityDataInputProps = {
  onAddRecord: (record: ActivityRecord) => void
}

type ActivityFormState = {
  date: string
  activityType: ActivityType | ""
  description: string
  amount: string
}

const INITIAL_FORM: ActivityFormState = {
  date: "",
  activityType: "",
  description: "",
  amount: "",
}

const ACTIVITY_TYPE_OPTIONS = Object.entries(ACTIVITY_TYPE_LABELS).map(
  ([value, label]) => ({
    value: value as ActivityType,
    label,
  })
)

const ActivityDataInput = ({ onAddRecord }: ActivityDataInputProps) => {
  const [form, setForm] = useState<ActivityFormState>(INITIAL_FORM)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const descriptionOptions = useMemo(() => {
    if (!form.activityType) return []

    return EMISSION_FACTORS.filter(
      (factor) => factor.activityType === form.activityType
    ).map((factor) => factor.description)
  }, [form.activityType])

  const selectedUnit = form.activityType
    ? ACTIVITY_TYPE_UNITS[form.activityType]
    : ""

  const setValidationError = (message: string) => {
    setMessage(message)
    setIsError(true)
  }

  const handleActivityTypeChange = (activityType: ActivityType) => {
    setForm((prev) => ({
      ...prev,
      activityType,
      description: "",
    }))
    setMessage("")
    setIsError(false)
  }

  const handleDescriptionChange = (description: string) => {
    setForm((prev) => ({
      ...prev,
      description,
    }))
    setMessage("")
    setIsError(false)
  }

  const handleSubmit = () => {
    if (!form.date) {
      setValidationError("날짜를 입력해주세요.")
      return
    }

    if (!form.activityType) {
      setValidationError("활동 유형을 선택해주세요.")
      return
    }

    if (!form.description) {
      setValidationError("항목을 선택해주세요.")
      return
    }

    if (!form.amount) {
      setValidationError("사용량을 입력해주세요.")
      return
    }

    const amount = Number(form.amount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setValidationError("사용량은 0보다 큰 숫자로 입력해주세요.")
      return
    }

    const matchedFactor = EMISSION_FACTORS.find(
      (factor) =>
        factor.activityType === form.activityType &&
        factor.description === form.description &&
        factor.activityUnit === selectedUnit
    )

    if (!matchedFactor) {
      setValidationError("선택한 활동 유형과 항목에 맞는 배출계수가 없습니다.")
      return
    }

    const newRecord: ActivityRecord = {
      id: `activity-${Date.now()}`,
      date: form.date,
      activityType: form.activityType,
      description: form.description,
      amount,
      unit: selectedUnit,
    }

    onAddRecord(newRecord)

    setForm(INITIAL_FORM)
    setMessage("활동 데이터가 추가되었습니다. 필터가 초기화되어 전체 목록에서 새 데이터를 확인할 수 있습니다.")
    setIsError(false)
  }

  return (
    <Card className="w-full overflow-visible">
      <CardHeader>
        <div>
          <CardTitle className="text-base">활동 데이터 입력</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            일자, 활동 유형, 항목, 사용량을 입력하면 배출량 계산에 사용할 수 있습니다.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 mt-3">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] xl:items-end">
          <div className="space-y-2">
            <Label htmlFor="activity-date">일자</Label>
            <Input
              id="activity-date"
              type="date"
              className="w-full"
              value={form.date}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  date: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>활동 유형</Label>
            <Select
              value={form.activityType}
              onValueChange={(value) =>
                handleActivityTypeChange(value as ActivityType)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="활동 유형 선택" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="z-50 min-w-[var(--radix-select-trigger-width)]"
              >
                {ACTIVITY_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>항목</Label>
            <Select
              value={form.description}
              onValueChange={handleDescriptionChange}
              disabled={!form.activityType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="항목 선택" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="z-50 min-w-[var(--radix-select-trigger-width)]"
              >
                {descriptionOptions.map((description) => (
                  <SelectItem key={description} value={description}>
                    {description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-amount">사용량</Label>
            <Input
              id="activity-amount"
              type="number"
              min="0"
              placeholder="사용량 입력"
              className="w-full"
              value={form.amount}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  amount: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-unit">단위</Label>
            <Input
              id="activity-unit"
              value={selectedUnit}
              placeholder="자동 표시"
              readOnly
              className="w-full bg-slate-50 text-slate-500"
            />
          </div>

          <Button type="button" className="h-9 cursor-pointer bg-slate-600 hover:bg-slate-800" onClick={handleSubmit}>
            <PlusCircle className="mr-2 h-4 w-4" />
            추가
          </Button>
        </div>

        {message && (
          <div
            className={
              isError
                ? "rounded-xl border border-red-200 bg-red-50 p-4"
                : "rounded-xl border border-blue-200 bg-blue-50 p-4"
            }
          >
            <p
              className={
                isError
                  ? "text-sm font-medium text-red-700"
                  : "text-sm font-medium text-blue-700"
              }
            >
              {isError ? "입력 오류" : "추가 완료"}
            </p>

            <p
              className={
                isError
                  ? "mt-2 text-sm text-red-600"
                  : "mt-2 text-sm text-blue-600"
              }
            >
              {message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ActivityDataInput
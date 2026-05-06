import { PlusCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"


const ActivityDataInput = () => {
  return (
     <Card className="w-full overflow-visible">
      <CardHeader>
        <div>
          <CardTitle className="text-base">활동 데이터 입력</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            일자, 활동 유형, 항목, 수량을 입력하면 배출량 계산에 사용할 수 있습니다.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 mt-3">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] xl:items-end">
          <div className="space-y-2">
            <Label htmlFor="activity-date">일자</Label>
            <Input id="activity-date" type="date" className="w-full" />
          </div>

          <div className="space-y-2">
            <Label>활동 유형</Label>
            <Select>
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
                <SelectItem value="electricity">전기</SelectItem>
                <SelectItem value="raw_material">원소재</SelectItem>
                <SelectItem value="transportation">운송</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>항목</Label>
            <Select>
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
                <SelectItem value="kepco">한국전력</SelectItem>
                <SelectItem value="plastic-1">플라스틱 1</SelectItem>
                <SelectItem value="plastic-2">플라스틱 2</SelectItem>
                <SelectItem value="truck">트럭</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-amount">수량</Label>
            <Input
              id="activity-amount"
              type="number"
              min="0"
              placeholder="수량 입력"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity-unit">단위</Label>
            <Input
              id="activity-unit"
              placeholder="자동 표시"
              readOnly
              className="w-full bg-slate-50 text-slate-500"
            />
          </div>

          <Button type="button" className="h-9 cursor-pointer bg-slate-600 hover:bg-slate-800">
            <PlusCircle className="mr-2 h-4 w-4" />
            추가
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityDataInput
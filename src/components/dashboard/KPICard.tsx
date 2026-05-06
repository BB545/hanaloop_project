import { cn } from "@/lib/utils"
import { Card, CardContent } from "../ui/card"

type KPICardProps = {
  title: string
  value: string
  description: string
  valueClassName?: string
}

const KPICard = ({
  title,
  value,
  description,
  valueClassName,
}: KPICardProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className={cn(
              "mt-3 text-2xl font-bold tracking-tight text-slate-950",
              valueClassName
            )}>
              {value}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  )
}

export default KPICard
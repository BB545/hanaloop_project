import { ReactNode } from "react"
import { Card, CardContent } from "../ui/card"

type KPICardProps = {
  title: string
  value: string
  description: string
  icon?: ReactNode
}

const KPICard = ({ title, value, description, icon }: KPICardProps) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
              {value}
            </p>
          </div>

          {icon && (
            <div className="rounded-xl bg-slate-100 p-2 text-slate-500">
              {icon}
            </div>
          )}
        </div>

        <p className="mt-3 text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  )
}

export default KPICard
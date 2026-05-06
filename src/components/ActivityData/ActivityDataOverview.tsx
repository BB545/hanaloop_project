import { CalculatedActivityRecord } from "@/types/carbon"
import ActivityDataInput from "./ActivityDataInput"
import ActivityDataTable from "./ActivityDataTable"

type ActivityDataOverviewProps = {
  records: CalculatedActivityRecord[]
}

const ActivityDataOverview = ({ records }: ActivityDataOverviewProps) => {
  return (
    <section className="space-y-6">
      <ActivityDataInput />
      <ActivityDataTable records={records} />
    </section>
  )
}

export default ActivityDataOverview
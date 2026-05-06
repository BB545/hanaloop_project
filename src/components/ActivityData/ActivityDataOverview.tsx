import { ActivityRecord, CalculatedActivityRecord } from "@/types/carbon"
import ActivityDataInput from "./ActivityDataInput"
import ActivityDataTable from "./ActivityDataTable"

type ActivityDataOverviewProps = {
  records: CalculatedActivityRecord[]
  onAddRecord: (record: ActivityRecord) => void
}

const ActivityDataOverview = ({ records, onAddRecord }: ActivityDataOverviewProps) => {
  return (
    <section className="space-y-6">
      <ActivityDataInput onAddRecord={onAddRecord} />
      <ActivityDataTable records={records} />
    </section>
  )
}

export default ActivityDataOverview
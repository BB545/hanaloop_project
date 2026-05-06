import { ActivityRecord, CalculatedActivityRecord } from "@/types/carbon"
import ActivityDataInput from "./ActivityDataInput"
import ActivityDataTable from "./ActivityDataTable"

type ActivityDataOverviewProps = {
  records: CalculatedActivityRecord[]
  onAddRecord: (record: ActivityRecord) => Promise<void>
  onRefreshRecords: () => Promise<void>
}

const ActivityDataOverview = ({ records, onAddRecord, onRefreshRecords }: ActivityDataOverviewProps) => {
  return (
    <section className="space-y-6">
      <ActivityDataInput onAddRecord={onAddRecord} onImportSuccess={onRefreshRecords} />
      <ActivityDataTable records={records} />
    </section>
  )
}

export default ActivityDataOverview
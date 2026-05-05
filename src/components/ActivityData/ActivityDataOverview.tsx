import ActivityDataInput from "./ActivityDataInput"
import ActivityDataTable from "./ActivityDataTable"

type ActivityDataOverviewProps = {
  filteredCount: number
}

const ActivityDataOverview = ({ filteredCount }: ActivityDataOverviewProps) => {
  return (
    <section className="space-y-6">
      <ActivityDataInput />
      <ActivityDataTable filteredCount={filteredCount} />
    </section>
  )
}

export default ActivityDataOverview
import type { ActivityRecord, FilterState } from "@/types/carbon"

export function filterActivityRecords(
  records: ActivityRecord[],
  filters: FilterState
): ActivityRecord[] {
  return records.filter((record) => {
    const matchesStartDate =
      !filters.dateRange?.start || record.date >= filters.dateRange.start

    const matchesEndDate =
      !filters.dateRange?.end || record.date <= filters.dateRange.end

    const matchesActivityType =
      filters.activityType === "all" ||
      record.activityType === filters.activityType

    const matchesDescription =
      filters.description === "all" ||
      record.description === filters.description

    return (
      matchesStartDate &&
      matchesEndDate &&
      matchesActivityType &&
      matchesDescription
    )
  })
}
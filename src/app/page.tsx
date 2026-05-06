"use client"

import ActivityDataOverview from "@/components/ActivityData/ActivityDataOverview";
import PageContainer from "@/components/common/PageContainer";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import Header from "@/components/layout/Header";
import MethodologyOverview from "@/components/methodology/MethodologyOverview";
import { DashboardTab } from "@/constants/navigation";
import { INITIAL_ACTIVITY_RECORDS } from "@/data/activityRecords";
import { EMISSION_FACTORS } from "@/data/emissionFactors";
import { calculateActivityRecords, calculateDashboardSummary, calculateDataQuality, getEmissionsByActivityType, getEmissionsByDescription, getMonthlyEmissions } from "@/lib/caculate";
import { filterActivityRecords } from "@/lib/FilterRecords";
import { ActivityRecord, FilterState } from "@/types/carbon";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_FILTERS: FilterState = {
  dateRange: null,
  activityType: 'all',
  description: 'all',
}

const DEFAULT_TAB: DashboardTab = "dashboard"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard")
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>(
    INITIAL_ACTIVITY_RECORDS
  )

  useEffect(() => {
    const savedTab = window.localStorage.getItem("activeTab")

    if (
      savedTab === "dashboard" ||
      savedTab === "activity-data" ||
      savedTab === "methodology"
    ) {
      setActiveTab(savedTab)
    }

    setIsMounted(true)
  }, [])

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab)
    window.localStorage.setItem("activeTab", tab)
  }

  const descriptions = useMemo(() => {
    return Array.from(
      new Set(activityRecords.map((record) => record.description)),
    )
  }, [activityRecords])

  const filteredRecords = useMemo(() => {
    return filterActivityRecords(activityRecords, filters)
  }, [activityRecords, filters])

  const calculatedRecords = useMemo(() => {
    return calculateActivityRecords(filteredRecords, EMISSION_FACTORS)
  }, [filteredRecords])

  const dashboardSummary = useMemo(() => {
    return calculateDashboardSummary(calculatedRecords)
  }, [calculatedRecords])

  const monthlyEmissions = useMemo(() => {
    return getMonthlyEmissions(calculatedRecords)
  }, [calculatedRecords])

  const emissionsByActivityType = useMemo(() => {
    return getEmissionsByActivityType(calculatedRecords)
  }, [calculatedRecords])

  const emissionsByDescription = useMemo(() => {
    return getEmissionsByDescription(calculatedRecords)
  }, [calculatedRecords])

  const dataQuality = useMemo(() => {
    return calculateDataQuality(filteredRecords, calculatedRecords)
  }, [filteredRecords, calculatedRecords])

  const handleAddActivityRecord = (record: ActivityRecord) => {
    setActivityRecords((prevRecords) => [record, ...prevRecords])
    setFilters(DEFAULT_FILTERS)
  }

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      <PageContainer>
        {activeTab == "dashboard" && (
          <DashboardOverview
            filters={filters}
            descriptions={descriptions}
            filteredRecords={filteredRecords}
            onFiltersChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            summary={dashboardSummary}
            monthlyEmissions={monthlyEmissions}
            emissionsByActivityType={emissionsByActivityType}
            emissionsByDescription={emissionsByDescription}
            dataQuality={dataQuality}
            onMoveToActivityData={() => handleTabChange("activity-data")}
          />
        )}

        {activeTab === "activity-data" && (
          <ActivityDataOverview
            records={calculatedRecords}
            onAddRecord={handleAddActivityRecord}
          />
        )}

        {activeTab === "methodology" && (
          <MethodologyOverview />
        )}
      </PageContainer>
    </>
  );
}

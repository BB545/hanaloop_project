"use client"

import ActivityDataOverview from "@/components/ActivityData/ActivityDataOverview";
import PageContainer from "@/components/common/PageContainer";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import Header from "@/components/layout/Header";
import MethodologyOverview from "@/components/methodology/MethodologyOverview";
import { DashboardTab } from "@/constants/navigation";
import { INITIAL_ACTIVITY_RECORDS } from "@/data/activityRecords";
import { EMISSION_FACTORS } from "@/data/emissionFactors";
import { calculateActivityRecords, calculateDashboardSummary, calculateDataQuality, getEmissionsByActivityType, getEmissionsByDescription, getMonthlyEmissions, getRecentCalculatedRecords } from "@/lib/caculate";
import { filterActivityRecords } from "@/lib/FilterRecords";
import { ActivityRecord, FilterState } from "@/types/carbon";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_FILTERS: FilterState = {
  dateRange: null,
  activityType: 'all',
  description: 'all',
}

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

  const hasActiveFilters = useMemo(() => {
    return (
      !!filters.dateRange?.start ||
      !!filters.dateRange?.end ||
      filters.activityType !== "all" ||
      filters.description !== "all"
    )
  }, [filters])

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

  const dashboardBaseRecords = useMemo(() => {
    return hasActiveFilters
      ? calculatedRecords
      : getRecentCalculatedRecords(calculatedRecords, 12)
  }, [hasActiveFilters, calculatedRecords])

  const dashboardBaseRawRecords = useMemo(() => {
    if (hasActiveFilters) {
      return filteredRecords
    }

    const dashboardBaseIds = new Set(
      dashboardBaseRecords.map((record) => record.id)
    )

    return filteredRecords.filter((record) => dashboardBaseIds.has(record.id))
  }, [hasActiveFilters, filteredRecords, dashboardBaseRecords])

  const dashboardSummary = useMemo(() => {
    return calculateDashboardSummary(dashboardBaseRecords)
  }, [dashboardBaseRecords])

  const monthlyEmissions = useMemo(() => {
    return getMonthlyEmissions(dashboardBaseRecords)
  }, [dashboardBaseRecords])

  const emissionsByActivityType = useMemo(() => {
    return getEmissionsByActivityType(dashboardBaseRecords)
  }, [dashboardBaseRecords])

  const emissionsByDescription = useMemo(() => {
    return getEmissionsByDescription(dashboardBaseRecords).slice(0, 5)
  }, [dashboardBaseRecords])

  const dataQuality = useMemo(() => {
    return calculateDataQuality(dashboardBaseRawRecords, dashboardBaseRecords)
  }, [dashboardBaseRawRecords, dashboardBaseRecords])

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
            filteredRecords={dashboardBaseRecords}
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
            records={dashboardBaseRecords}
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

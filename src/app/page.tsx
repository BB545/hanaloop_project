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
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>(INITIAL_ACTIVITY_RECORDS)

  const fetchActivityRecords = async () => {
    try {
      const response = await fetch("/api/activity-records")
      const text = await response.text()

      const data = text ? JSON.parse(text) : { records: [] }

      if (!response.ok) {
        console.error("활동 데이터 조회 실패:", data.message)
        setActivityRecords(INITIAL_ACTIVITY_RECORDS)
        return
      }

      const dbRecords = Array.isArray(data.records) ? data.records : []

      setActivityRecords([
        ...INITIAL_ACTIVITY_RECORDS,
        ...dbRecords,
      ])
    } catch (error) {
      console.error("활동 데이터 조회 실패", error)
      setActivityRecords([])
    }
  }

  useEffect(() => {
    const savedTab = window.localStorage.getItem("activeTab")

    if (
      savedTab === "dashboard" ||
      savedTab === "activity-data" ||
      savedTab === "methodology"
    ) {
      setActiveTab(savedTab)
    }

    const initializePage = async () => {
      await fetchActivityRecords()
      setIsMounted(true)
    }

    initializePage()
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

  const handleAddActivityRecord = async (record: ActivityRecord) => {
    try {
      const response = await fetch("/api/activity-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      })

      const data = await response.json()

      if (!response.ok) {
        console.warn("활동 데이터 저장 실패:", data.message)

        setActivityRecords((prevRecords) => [record, ...prevRecords])
        setFilters(DEFAULT_FILTERS)
        return
      }

      await fetchActivityRecords()
      setFilters(DEFAULT_FILTERS)
    } catch (error) {
      console.error("활동 데이터 저장 실패", error)
      setActivityRecords((prevRecords) => [record, ...prevRecords])
      setFilters(DEFAULT_FILTERS)
    }
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
            onRefreshRecords={fetchActivityRecords}
          />
        )}

        {activeTab === "methodology" && (
          <MethodologyOverview />
        )}
      </PageContainer>
    </>
  );
}

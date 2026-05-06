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
import { FilterState } from "@/types/carbon";
import { useMemo, useState } from "react";

const DEFAULT_FILTERS: FilterState = {
  dateRange: null,
  activityType: 'all',
  description: 'all',
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard")
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const descriptions = useMemo(() => {
    return Array.from(
      new Set(INITIAL_ACTIVITY_RECORDS.map((record) => record.description)),
    )
  }, [])

  const filteredRecords = useMemo(() => {
    return filterActivityRecords(INITIAL_ACTIVITY_RECORDS, filters)
  }, [filters])

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

  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

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
          />
        )}

        {activeTab === "activity-data" && (
          <ActivityDataOverview records={calculatedRecords} />
        )}

        {activeTab === "methodology" && (
          <MethodologyOverview />
        )}
      </PageContainer>
    </>
  );
}

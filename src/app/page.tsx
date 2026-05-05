"use client"

import ActivityDataOverview from "@/components/ActivityData/ActivityDataOverview";
import PageContainer from "@/components/common/PageContainer";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import Header from "@/components/layout/Header";
import { DashboardTab } from "@/constants/navigation";
import { INITIAL_ACTIVITY_RECORDS } from "@/data/activityRecords";
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
            />
        )}

        {activeTab === "activity-data" && (
          <ActivityDataOverview filteredCount={filteredRecords.length} />
        )}

        {activeTab === "methodology" && (
          <section>
            <h2 className="text-xl font-semibold">계산 기준</h2>
            <p className="mt-2 text-sm text-slate-500">
              PCF 계산 방식, 배출계수, 버전 관리 구조를 설명하는 영역입니다.
            </p>
          </section>
        )}
      </PageContainer>
    </>
  );
}

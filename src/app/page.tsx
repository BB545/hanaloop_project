"use client"

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
          <section>
            <DashboardOverview
              filters={filters}
              descriptions={descriptions}
              filteredRecords={filteredRecords}
              onFiltersChange={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />
          </section>
        )}

        {activeTab === "activity-data" && (
          <section>
            <h2 className="text-xl font-semibold">활동 데이터</h2>
            <p className="mt-2 text-sm text-slate-500">
              원본 활동 데이터와 계산된 배출량을 테이블로 확인하는 영역입니다.
            </p>
          </section>
        )}

        {activeTab === "data-input" && (
          <section>
            <h2 className="text-xl font-semibold">데이터 입력</h2>
            <p className="mt-2 text-sm text-slate-500">
              새로운 활동 데이터를 입력하고 오류 메시지를 확인하는 영역입니다.
            </p>
          </section>
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

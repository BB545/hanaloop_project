"use client"

import PageContainer from "@/components/common/PageContainer";
import Header from "@/components/layout/Header";
import { DashboardTab } from "@/constants/navigation";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard")
  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <PageContainer>
        {activeTab == "dashboard" && (
          <section>
            <h2 className="text-xl font-semibold">대시보드</h2>
            <p className="mt-2 text-sm text-slate-500">
              총 배출량, 월별 추이, 활동 유형별 비중, 항목별 순위를 표시할 영역입니다.
            </p>
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

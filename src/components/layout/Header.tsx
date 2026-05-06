"use client"

import type { DashboardTab } from "@/constants/navigation"
import DashboardTabs from "./DashboardTabs"
import Image from "next/image"

type HeaderProps = {
    activeTab: DashboardTab
    onTabChange: (tab: DashboardTab) => void
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                                <Image src="/logos/logo.png" alt="logo" width={40} height={40} />
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    PCF 대시보드
                                </h1>
                                <p className="text-sm text-gray-600">
                                    제품 탄소 발자국(PCF) 데이터를 계산하고 시각화하는 대시보드
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <DashboardTabs activeTab={activeTab} onTabChange={onTabChange} />
            </div>
        </header>
    )
}

export default Header
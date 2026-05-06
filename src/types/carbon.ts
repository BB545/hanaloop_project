export type ActivityType = 'electricity' | 'raw_material' | 'transportation'

export type ActivityUnit = 'kWh' | 'kg' | 'ton-km'

export interface ActivityRecord {
    id: string
    date: string
    activityType: ActivityType
    description: string
    amount: number
    unit: string
}

export interface EmissionFactor {
    id: string
    activityType: ActivityType
    description: string
    factor: number
    activityUnit: ActivityUnit
    factorUnit: string
    version: string
    effectiveFrom: string
    effectiveTo?: string | null
}

export interface CalculatedActivityRecord extends ActivityRecord {
    emissionFactor: number
    emissionFactorUnit: string
    emissionsKgCO2e: number
}

export interface MonthlyEmission {
  month: string
  emissions: number
}

// 도넛차트
export interface EmissionByActivityType {
  activityType: ActivityType
  emissions: number
  fill: string
  percentage: number
}

export interface EmissionByDescription {
  description: string
  activityType: ActivityType
  emissions: number
}

export interface FilterState {
  dateRange: { start: string; end: string } | null
  activityType: ActivityType | 'all'
  description: string | 'all'
}

export const ACTIVITY_TYPE_UNITS: Record<ActivityType, ActivityUnit> = {
  electricity: 'kWh',
  raw_material: 'kg',
  transportation: 'ton-km',
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  electricity: '전기',
  raw_material: '원소재',
  transportation: '운송',
}

// 차트 색상 구현
export const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  electricity: 'var(--chart-1)',
  raw_material: 'var(--chart-2)',
  transportation: 'var(--chart-3)',
}
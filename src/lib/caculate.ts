import { ACTIVITY_TYPE_LABELS, type ActivityRecord, type CalculatedActivityRecord, type EmissionByActivityType, type EmissionByDescription, type EmissionFactor, type MonthlyEmission } from "@/types/carbon"

export type DashboardSummary = {
    totalEmissions: number
    monthlyChangeRate: number
    topActivityType: {
        label: string
        emissions: number
        percentage: number
    } | null
    topDescription: {
        description: string
        emissions: number
    } | null
}

export type DataQualitySummary = {
    totalCount: number
    validCount: number
    errorCount: number
    matchingRate: number
}

function findEmissionFactor(
    record: ActivityRecord,
    emissionFactors: EmissionFactor[]
): EmissionFactor | undefined {
    return emissionFactors.find(
        (factor) =>
            factor.activityType === record.activityType &&
            factor.description === record.description &&
            factor.activityUnit === record.unit
    )
}

export function calculateActivityRecords(
    records: ActivityRecord[],
    emissionFactors: EmissionFactor[]
): CalculatedActivityRecord[] {
    return records
        .map((record) => {
            const emissionFactor = findEmissionFactor(record, emissionFactors)

            if (!emissionFactor) {
                return null
            }

            return {
                ...record,
                emissionFactor: emissionFactor.factor,
                emissionFactorUnit: emissionFactor.factorUnit,
                emissionsKgCO2e: record.amount * emissionFactor.factor,
            }
        })
        .filter((record): record is CalculatedActivityRecord => record !== null)
}

export function calculateDataQuality(
    records: ActivityRecord[],
    calculatedRecords: CalculatedActivityRecord[]
): DataQualitySummary {
    const totalCount = records.length
    const validCount = calculatedRecords.length
    const errorCount = totalCount - validCount
    const matchingRate = totalCount === 0 ? 0 : (validCount / totalCount) * 100

    return {
        totalCount,
        validCount,
        errorCount,
        matchingRate,
    }
}

export function getMonthlyEmissions(
    records: CalculatedActivityRecord[]
): MonthlyEmission[] {
    const monthlyMap = new Map<string, number>()

    records.forEach((record) => {
        const month = record.date.slice(0, 7)
        const current = monthlyMap.get(month) ?? 0
        monthlyMap.set(month, current + record.emissionsKgCO2e)
    })

    return Array.from(monthlyMap.entries())
        .map(([month, emissions]) => ({
            month,
            emissions,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
}

export function getRecentCalculatedRecords(
    records: CalculatedActivityRecord[],
    monthLimit = 12
): CalculatedActivityRecord[] {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const startMonth = new Date(
        currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() - (monthLimit - 1),
        1
    )

    const endMonth = new Date(
        currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() + 1,
        1
    )

    return records.filter((record) => {
        const [year, month] = record.date.split("-").map(Number)
        const recordMonth = new Date(year, month - 1, 1)

        return recordMonth >= startMonth && recordMonth < endMonth
    })
}

export function getEmissionsByActivityType(
    records: CalculatedActivityRecord[]
): EmissionByActivityType[] {
    const totalEmissions = records.reduce(
        (sum, record) => sum + record.emissionsKgCO2e,
        0
    )

    const activityMap = new Map<string, number>()

    records.forEach((record) => {
        const current = activityMap.get(record.activityType) ?? 0
        activityMap.set(record.activityType, current + record.emissionsKgCO2e)
    })

    return Array.from(activityMap.entries()).map(([activityType, emissions]) => ({
        activityType: activityType as CalculatedActivityRecord["activityType"],
        emissions,
        percentage: totalEmissions === 0 ? 0 : (emissions / totalEmissions) * 100,
        fill: "",
    }))
}

export function getEmissionsByDescription(
    records: CalculatedActivityRecord[]
): EmissionByDescription[] {
    const descriptionMap = new Map<
        string,
        {
            description: string
            activityType: CalculatedActivityRecord["activityType"]
            emissions: number
        }
    >()

    records.forEach((record) => {
        const current = descriptionMap.get(record.description)

        if (!current) {
            descriptionMap.set(record.description, {
                description: record.description,
                activityType: record.activityType,
                emissions: record.emissionsKgCO2e,
            })

            return
        }

        descriptionMap.set(record.description, {
            ...current,
            emissions: current.emissions + record.emissionsKgCO2e,
        })
    })

    return Array.from(descriptionMap.values()).sort(
        (a, b) => b.emissions - a.emissions
    )
}

export function calculateDashboardSummary(
    records: CalculatedActivityRecord[]
): DashboardSummary {
    const totalEmissions = records.reduce(
        (sum, record) => sum + record.emissionsKgCO2e,
        0
    )

    const monthlyEmissions = getMonthlyEmissions(records)
    const lastMonth = monthlyEmissions.at(-1)
    const previousMonth = monthlyEmissions.at(-2)

    const monthlyChangeRate =
        lastMonth && previousMonth && previousMonth.emissions > 0
            ? ((lastMonth.emissions - previousMonth.emissions) /
                previousMonth.emissions) *
            100
            : 0

    const emissionsByActivityType = getEmissionsByActivityType(records)

    const topActivityType =
        emissionsByActivityType.length > 0
            ? emissionsByActivityType.reduce((max, current) =>
                current.emissions > max.emissions ? current : max
            )
            : null

    const emissionsByDescription = getEmissionsByDescription(records)

    const topDescription =
        emissionsByDescription.length > 0 ? emissionsByDescription[0] : null

    return {
        totalEmissions,
        monthlyChangeRate,
        topActivityType: topActivityType
            ? {
                label: ACTIVITY_TYPE_LABELS[topActivityType.activityType],
                emissions: topActivityType.emissions,
                percentage: topActivityType.percentage,
            }
            : null,
        topDescription,
    }
}
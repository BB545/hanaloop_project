import { NextResponse } from "next/server"

import { pool } from "@/lib/db"
import type { ActivityRecord } from "@/types/carbon"

export const runtime = "nodejs"

type ActivityRecordRow = {
    id: string
    date: string
    activity_type: ActivityRecord["activityType"]
    description: string
    amount: string
    unit: string
}

const toActivityRecord = (row: ActivityRecordRow): ActivityRecord => {
    return {
        id: row.id,
        date: row.date,
        activityType: row.activity_type,
        description: row.description,
        amount: Number(row.amount),
        unit: row.unit,
    }
}

export async function GET() {
    try {
        const result = await pool.query<ActivityRecordRow>(`
      SELECT
        id,
        TO_CHAR(date, 'YYYY-MM-DD') AS date,
        activity_type,
        description,
        amount::text AS amount,
        unit
      FROM activity_records
      ORDER BY date DESC, created_at DESC
    `)

        return NextResponse.json({
            records: result.rows.map(toActivityRecord),
        })
    } catch (error) {
        console.error("활동 데이터 조회 API 오류:", error)

        const message =
            error instanceof Error
                ? error.message
                : "활동 데이터 조회 중 오류가 발생했습니다."

        return NextResponse.json(
            {
                records: [],
                message,
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const record = (await request.json()) as ActivityRecord

        await pool.query(
            `
      INSERT INTO activity_records
        (id, date, activity_type, description, amount, unit, source)
      VALUES
        ($1, $2, $3, $4, $5, $6, 'manual')
      `,
            [
                record.id,
                record.date,
                record.activityType,
                record.description,
                record.amount,
                record.unit,
            ]
        )

        return NextResponse.json({
            message: "활동 데이터가 저장되었습니다.",
            record,
        })
    } catch (error) {
        console.error("활동 데이터 저장 API 오류:", error)

        return NextResponse.json(
            { message: "활동 데이터 저장 중 오류가 발생했습니다." },
            { status: 500 }
        )
    }
}
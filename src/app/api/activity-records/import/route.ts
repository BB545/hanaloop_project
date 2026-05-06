import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

import { pool } from "@/lib/db"
import type { ActivityRecord, ActivityType } from "@/types/carbon"

export const runtime = "nodejs"

const ACTIVITY_TYPE_MAP: Record<string, ActivityType> = {
  전기: "electricity",
  원소재: "raw_material",
  원자재: "raw_material",
  운송: "transportation",
}

type ExcelActivityRow = {
  "일자(원본)"?: string | number | Date
  "활동 유형"?: string
  설명?: string
  량?: number | string
  단위?: string
}

const formatExcelDate = (value: string | number | Date): string => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  if (typeof value === "number") {
    const parsedDate = XLSX.SSF.parse_date_code(value)

    if (!parsedDate) {
      throw new Error(`엑셀 날짜 형식을 변환할 수 없습니다: ${value}`)
    }

    const year = parsedDate.y
    const month = String(parsedDate.m).padStart(2, "0")
    const day = String(parsedDate.d).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  return String(value).slice(0, 10)
}

const normalizeActivityType = (value: string): ActivityType => {
  const activityType = ACTIVITY_TYPE_MAP[value.trim()]

  if (!activityType) {
    throw new Error(`지원하지 않는 활동 유형입니다: ${value}`)
  }

  return activityType
}

const createRecordId = (index: number) => {
  return `excel-${Date.now()}-${index}`
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "엑셀 파일을 업로드해주세요." },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellDates: true,
  })

  const worksheet = workbook.Sheets["과제용 데이터"]

  if (!worksheet) {
    return NextResponse.json(
      { message: "과제용 데이터 시트를 찾을 수 없습니다." },
      { status: 400 }
    )
  }

  const rows = XLSX.utils.sheet_to_json<ExcelActivityRow>(worksheet, {
    range: 2,
    defval: "",
  })

  const activityRows = rows.filter((row) => {
    return (
      row["일자(원본)"] &&
      row["활동 유형"] &&
      row["설명"] &&
      row["량"] !== "" &&
      row["단위"]
    )
  })

  if (activityRows.length === 0) {
    return NextResponse.json(
      { message: "임포트할 활동 데이터가 없습니다." },
      { status: 400 }
    )
  }

  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const importedRecords: ActivityRecord[] = []

    for (const [index, row] of activityRows.entries()) {
      const activityType = normalizeActivityType(String(row["활동 유형"]))
      const date = formatExcelDate(row["일자(원본)"]!)
      const description = String(row["설명"]).trim()
      const amount = Number(row["량"])
      const unit = String(row["단위"]).trim()

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error(`사용량이 올바르지 않습니다: ${amount}`)
      }

      const record: ActivityRecord = {
        id: createRecordId(index),
        date,
        activityType,
        description,
        amount,
        unit,
      }

      await client.query(
        `
        INSERT INTO activity_records
          (id, date, activity_type, description, amount, unit, source)
        VALUES
          ($1, $2, $3, $4, $5, $6, 'excel')
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

      importedRecords.push(record)
    }

    await client.query("COMMIT")

    return NextResponse.json({
      message: "엑셀 데이터가 PostgreSQL에 저장되었습니다.",
      count: importedRecords.length,
      records: importedRecords,
    })
  } catch (error) {
    await client.query("ROLLBACK")

    console.error("엑셀 임포트 API 오류:", error)

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "엑셀 데이터 저장 중 오류가 발생했습니다.",
      },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
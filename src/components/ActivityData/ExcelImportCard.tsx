"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

type ExcelImportCardProps = {
  onImportSuccess: () => Promise<void>
}

const ExcelImportCard = ({ onImportSuccess }: ExcelImportCardProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null

    setFile(selectedFile)
    setMessage("")
    setIsError(false)
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("업로드할 엑셀 파일을 선택해주세요.")
      setIsError(true)
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setIsUploading(true)

      const response = await fetch("/api/activity-records/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message ?? "엑셀 업로드 중 오류가 발생했습니다.")
        setIsError(true)
        return
      }

      await onImportSuccess()

      setFile(null)
      setMessage(`${data.count}건의 엑셀 데이터가 PostgreSQL에 저장되었습니다.`)
      setIsError(false)
    } catch (error) {
      console.error("엑셀 업로드 실패", error)
      setMessage("엑셀 업로드 중 오류가 발생했습니다.")
      setIsError(true)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full overflow-visible">
      <CardHeader>
        <div>
          <CardTitle className="text-base">엑셀 데이터 가져오기</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            과제 제공 엑셀 파일을 업로드하면 별도 가공 없이 PostgreSQL에 저장됩니다.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label htmlFor="excel-file">엑셀 파일</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="h-9 cursor-pointer bg-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "업로드 중" : "업로드"}
          </Button>
        </div>

        {file && (
          <p className="text-sm text-slate-500">
            선택한 파일: <span className="font-medium">{file.name}</span>
          </p>
        )}

        {message && (
          <div
            className={
              isError
                ? "rounded-xl border border-red-200 bg-red-50 p-4"
                : "rounded-xl border border-blue-200 bg-blue-50 p-4"
            }
          >
            <p
              className={
                isError
                  ? "text-sm font-medium text-red-700"
                  : "text-sm font-medium text-blue-700"
              }
            >
              {isError ? "업로드 오류" : "업로드 완료"}
            </p>
            <p
              className={
                isError
                  ? "mt-2 text-sm text-red-600"
                  : "mt-2 text-sm text-blue-600"
              }
            >
              {message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ExcelImportCard
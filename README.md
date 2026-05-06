# PCF 대시보드

제품 생산 과정에서 발생하는 활동 데이터를 기반으로 PCF(Product Carbon Footprint) 배출량을 계산하고, 대시보드 형태로 시각화하는 웹 애플리케이션입니다.

전기 사용, 원소재 사용, 운송 활동 데이터를 입력하거나 과제 제공 엑셀 파일을 업로드하면 PostgreSQL에 저장되며, 저장된 데이터를 기준으로 총 배출량, 전월 대비 증감률, 주요 배출 활동 유형, 항목별 배출량 등을 확인할 수 있습니다.

---

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [UI 실행 과정](#ui-실행-과정)
- [데이터 처리 기준](#데이터-처리-기준)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [로컬 실행 방법](#로컬-실행-방법)
- [DB 초기화 방법](#db-초기화-방법)
- [API 명세](#api-명세)
- [AI 도구 활용 내역](#ai-도구-활용-내역)
- [추가 구현 사항](#추가-구현-사항)
- [주의 사항](#주의-사항)
- [향후 개선 가능 사항](#향후-개선-가능-사항)

---

## 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트 이름 | PCF 대시보드 |
| 목적 | 활동 데이터 기반 제품 탄소배출량 계산 및 시각화 |
| 주요 사용자 | PCF 데이터를 관리하고 배출량 흐름을 확인해야 하는 담당자 |
| 주요 데이터 | 전기, 원소재, 운송 활동 데이터 |
| 저장 방식 | PostgreSQL |
| 실행 환경 | Docker Compose + Next.js |

---

## 주요 기능

### 1. 대시보드

- 현재 조건 기준 총 배출량 표시
- 전월 대비 배출량 증감률 표시
- 최대 배출 활동 유형 표시
- 최대 배출 항목 표시
- 월별 배출량 추이 차트 제공
- 활동 유형별 배출 비중 도넛 차트 제공
- 항목별 배출량 Top 5 차트 제공
- 데이터 품질 요약 제공

### 2. 필터 기능

- 날짜 범위 필터
- 활동 유형 필터
- 항목 필터
- 필터 초기화 기능
- 필터 결과에 따른 KPI, 차트, 데이터 품질 요약 갱신

### 3. 활동 데이터 관리

- 활동 데이터 직접 입력
- 활동 유형 선택 시 항목 옵션 자동 갱신
- 활동 유형 선택 시 단위 자동 표시
- 입력값 검증
- PostgreSQL 저장
- 저장 후 테이블 및 대시보드 갱신
- 최신 날짜순 활동 데이터 표시

### 4. 엑셀 데이터 임포트

- 과제 제공 엑셀 파일 업로드
- 별도 수동 가공 없이 `과제용 데이터` 시트 파싱
- 활동 유형 한글값을 내부 코드값으로 변환
- PostgreSQL에 활동 데이터 저장
- 업로드 성공 후 데이터 재조회 및 화면 반영

### 5. 도움말

- 배출량 계산식 안내
- 활동 유형별 배출계수 기준 안내
- 데이터 품질 계산 기준 안내
- 대시보드 지표 해석 기준 안내

---

## UI 실행 과정

### 1. 대시보드 초기 화면

기본 대시보드에서는 최근 12개월 기준의 PCF 요약 정보를 확인할 수 있습니다.

- 총 배출량
- 전월 대비 증감률
- 최대 배출 활동 유형
- 최대 배출 항목
- 월별 배출량 추이
- 활동 유형별 배출 비중
- 항목별 배출량 Top 5
- 데이터 품질 요약

<img src="./public/readme/upload1.gif" alt="대시보드 초기 화면" width="500" />

---

### 2. 필터 적용

사용자는 날짜 범위, 활동 유형, 항목 조건을 선택하여 원하는 데이터만 확인할 수 있습니다.

필터 적용 시 다음 영역이 함께 갱신됩니다.

- KPI 카드
- 월별 배출량 추이
- 활동 유형별 배출 비중
- 항목별 배출량 Top 5
- 데이터 품질 요약
- 활동 데이터 테이블

<img src="./public/readme/filter.png" alt="필터 적용 화면" width="500" />

---

### 3. 활동 데이터 직접 입력

데이터 관리 탭에서 활동 데이터를 직접 입력할 수 있습니다.

입력 항목은 다음과 같습니다.

| 입력 항목 | 설명 |
|---|---|
| 일자 | 활동 데이터 발생일 |
| 활동 유형 | 전기, 원소재, 운송 |
| 항목 | 활동 유형에 따라 자동 갱신 |
| 사용량 | 배출량 계산에 사용되는 활동량 |
| 단위 | 활동 유형에 따라 자동 표시 |

입력된 데이터는 PostgreSQL에 저장되며, 저장 후 화면 데이터가 갱신됩니다.

<img src="./public/readme/data1.png" alt="활동 데이터 입력 화면" width="500" />

---

### 4. 엑셀 데이터 가져오기

데이터 관리 탭에서 과제 제공 엑셀 파일을 업로드할 수 있습니다.

엑셀 파일 업로드 시 처리 흐름은 다음과 같습니다.

```text
엑셀 파일 선택
→ /api/activity-records/import 요청
→ 과제용 데이터 시트 파싱
→ 활동 데이터 구조로 변환
→ PostgreSQL 저장
→ DB 데이터 재조회
→ 대시보드 및 테이블 갱신
```

<img src="./public/readme/upload2.gif" alt="엑셀 데이터 업로드 화면" width="500" />

---

### 5. 활동 데이터 테이블 확인

저장된 활동 데이터는 데이터 관리 탭의 테이블에서 확인할 수 있습니다.

표시 항목은 다음과 같습니다.

| 컬럼 | 설명 |
|---|---|
| 날짜 | 활동 데이터 발생일 |
| 활동 유형 | 전기, 원소재, 운송 |
| 항목명 | 세부 활동 항목 |
| 사용량 | 입력된 활동량 |
| 단위 | kWh, kg, ton-km 등 |
| 배출계수 | 활동 항목에 적용된 계수 |
| 배출량 | 사용량 × 배출계수 |

<img src="./public/readme/data2.png" alt="활동 데이터 테이블 화면" width="500" />

---

## 데이터 처리 기준

### 배출량 계산식

```text
배출량(kgCO2e) = 사용량 × 배출계수
```

### 활동 유형

| 활동 유형 | 내부 코드 | 단위 예시 |
|---|---|---|
| 전기 | electricity | kWh |
| 원소재 | raw_material | kg |
| 운송 | transportation | ton-km |

### 배출계수 예시

| 활동 유형 | 항목 | 계수 | 단위 |
|---|---|---:|---|
| 전기 | 한국전력 | 0.456 | kgCO2e/kWh |
| 원소재 | 플라스틱 1 | 2.3 | kgCO2e/kg |
| 원소재 | 플라스틱 2 | 3.2 | kgCO2e/kg |
| 운송 | 트럭 | 3.5 | kgCO2e/ton-km |

### 대시보드 데이터 기준

| 상황 | 적용 기준 |
|---|---|
| 필터 미적용 | 현재 월 기준 최근 12개월 |
| 필터 적용 | 필터 조건에 해당하는 데이터 |
| 데이터 관리 테이블 | 필터 조건에 해당하는 전체 데이터 |
| 엑셀 업로드 데이터 | PostgreSQL 저장 후 재조회 |
| 직접 입력 데이터 | PostgreSQL 저장 후 재조회 |

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Component | shadcn/ui |
| Chart | Recharts |
| Database | PostgreSQL |
| DB Driver | pg |
| Excel Parsing | xlsx |
| Runtime Environment | Docker Compose |

---

## 로컬 실행 방법

### 1. 저장소 클론 및 패키지 설치

```bash
git clone https://github.com/BB545/hanaloop_project.git
cd hanaloop_project
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 예시:

```env
DATABASE_URL=postgresql://hanaloop:hanaloop@localhost:5433/hanaloop
```

### 3. PostgreSQL 실행

```bash
docker compose up -d
```

### 4. 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. 브라우저 접속

```text
http://localhost:3000
```

---

## DB 초기화 방법

테스트 데이터를 모두 지우고 DB를 초기 상태로 되돌리려면 아래 명령어를 실행합니다.

```bash
docker compose down -v
docker compose up -d
```

`db/init.sql`이 다시 실행되며 기본 테이블과 배출계수 데이터가 생성됩니다.

---

### ERD

| 테이블 | 설명 |
|---|---|
| `activity_records` | 엑셀 업로드 또는 직접 입력을 통해 저장되는 활동 데이터 |
| `emission_factors` | 활동 데이터의 배출량 계산에 사용되는 배출계수 기준 데이터 |

활동 데이터는 `activity_type`, `description`, `unit` 값을 기준으로 배출계수 테이블의 `activity_type`, `description`, `activity_unit`과 매칭됩니다.

```text
배출량(kgCO2e) = activity_records.amount × emission_factors.factor
```

```mermaid
erDiagram
    ACTIVITY_RECORDS {
        text id PK "활동 데이터 ID"
        date date "활동 일자"
        text activity_type "활동 유형"
        text description "활동 항목 설명"
        numeric amount "사용량"
        text unit "사용 단위"
        text source "데이터 출처"
        timestamp created_at "생성 시각"
    }

    EMISSION_FACTORS {
        serial id PK "배출계수 ID"
        text activity_type "활동 유형"
        text description "배출계수 항목 설명"
        text activity_unit "활동 단위"
        numeric factor "배출계수"
        text factor_unit "배출계수 단위"
        text version "배출계수 버전"
        timestamp created_at "생성 시각"
    }

    ACTIVITY_RECORDS }o--|| EMISSION_FACTORS : "activity_type + description + unit 기준 매칭"
```

---

## API 명세

### 활동 데이터 조회

```http
GET /api/activity-records
```

응답 예시:

```json
{
  "records": [
    {
      "id": "activity-1",
      "date": "2026-05-01",
      "activityType": "electricity",
      "description": "한국전력",
      "amount": 1000,
      "unit": "kWh"
    }
  ]
}
```

### 활동 데이터 직접 저장

```http
POST /api/activity-records
```

요청 예시:

```json
{
  "id": "activity-1",
  "date": "2026-05-01",
  "activityType": "electricity",
  "description": "한국전력",
  "amount": 1000,
  "unit": "kWh"
}
```

### 엑셀 데이터 임포트

```http
POST /api/activity-records/import
```

요청 형식:

```text
multipart/form-data
file: 과제 제공 엑셀 파일
```

처리 내용:

```text
과제용 데이터 시트 파싱
→ 활동 유형 코드 변환
→ PostgreSQL activity_records 테이블 저장
→ 저장 건수 반환
```

---

## AI 도구 활용 내역

본 프로젝트에서는 UI 설계, 데이터 처리 로직 구조화, DB 연동 설계, 엑셀 임포트 흐름 설계 과정에서 AI 도구를 보조적으로 활용했습니다.

### 1. v0 활용: 대시보드 초기 UI 구조 생성

| 항목 | 내용 |
|---|---|
| 사용 도구 | v0 |
| 활용 목적 | PCF 대시보드의 초기 화면 구조와 컴포넌트 레이아웃 설계 |
| 활용 결과 | KPI 카드, 필터 영역, 차트 그리드, 데이터 관리 화면의 초기 UI 구조 설계 |

사용 프롬프트:

```text
PCF(Product Carbon Footprint) 데이터를 분석하는 B2B SaaS 스타일의 대시보드 UI를 만들어줘.
상단에는 필터 영역을 두고, 그 아래에는 총 배출량, 전월 대비 증감률, 최대 배출 활동 유형, 최대 배출 항목을 보여주는 KPI 카드를 배치해줘.
하단에는 월별 배출량 추이, 활동 유형별 배출 비중, 항목별 배출량 순위를 보여주는 차트 영역을 구성해줘.
전체 스타일은 흰 배경 기반의 깔끔한 데이터 대시보드 느낌으로 해줘.
```

---

### 2. ChatGPT 활용: PCF 계산 로직 구조화

| 항목 | 내용 |
|---|---|
| 사용 도구 | ChatGPT |
| 활용 목적 | 활동 데이터와 배출계수를 매칭해 배출량을 계산하는 로직 설계 |
| 활용 결과 | 계산 함수 분리, 타입 정의, 집계 함수 구조 정리 |

사용 프롬프트:

```text
활동 데이터와 배출계수 데이터를 기반으로 PCF 배출량을 계산하는 TypeScript 함수를 설계해줘.
활동 데이터는 date, activityType, description, amount, unit을 가지고 있고,
배출계수는 activityType, description, activityUnit, factor, factorUnit을 가지고 있어.
두 데이터를 activityType, description, unit 기준으로 매칭한 뒤,
amount * factor로 emissionsKgCO2e를 계산하고,
계산 가능한 데이터만 CalculatedActivityRecord[]로 반환하는 구조로 작성해줘.
추후 대시보드 KPI와 차트에서 재사용할 수 있도록 함수 책임을 분리해줘.
```

---

### 3. ChatGPT 활용: 대시보드 집계 기준 설계

| 항목 | 내용 |
|---|---|
| 사용 도구 | ChatGPT |
| 활용 목적 | KPI와 차트에 사용할 집계 기준 정리 |
| 활용 결과 | 총 배출량, 전월 대비 증감률, 월별 추이, 활동 유형별 비중, 항목별 Top 5 계산 로직 구현 |

사용 프롬프트:

```text
PCF 대시보드에서 사용할 집계 함수를 설계해줘.
CalculatedActivityRecord[]를 입력으로 받아서
1. 총 배출량
2. 최근 월과 직전 월을 비교한 전월 대비 증감률
3. 활동 유형별 배출량과 비중
4. 설명 항목별 배출량 순위
5. 월별 배출량 추이
를 계산해야 해.
단, 화면 컴포넌트에서는 계산 로직을 직접 작성하지 않고 lib 함수로 분리하고 싶어.
각 함수의 역할과 TypeScript 타입까지 고려해서 구조를 제안해줘.
```

---

### 4. ChatGPT 활용: 엑셀 파일 PostgreSQL 임포트 설계

| 항목 | 내용 |
|---|---|
| 사용 도구 | ChatGPT |
| 활용 목적 | 과제 제공 엑셀 파일을 별도 가공 없이 PostgreSQL에 저장하는 흐름 설계 |
| 활용 결과 | xlsx 기반 엑셀 파싱, 한글 활동 유형 매핑, PostgreSQL insert API 구현 |

사용 프롬프트:

```text
Next.js App Router 환경에서 과제 제공 엑셀 파일을 업로드하면 PostgreSQL에 저장하는 import API를 설계해줘.
엑셀의 과제용 데이터 시트에는 일자(원본), 활동 유형, 설명, 량, 단위 컬럼이 있고,
활동 유형은 전기, 원소재, 운송처럼 한글로 들어 있어.
이를 내부 코드값인 electricity, raw_material, transportation으로 변환한 뒤
activity_records 테이블에 저장하고 싶어.
사용자가 엑셀을 직접 수정하지 않아도 되도록, 서버에서 시트명과 컬럼명을 기준으로 파싱하는 구조로 작성해줘.
```

---

## 추가 구현 사항

### 1. PostgreSQL 기반 데이터

기존에는 활동 데이터가 클라이언트 상태에만 저장되어 새로고침 시 사라졌습니다.  
현재는 활동 데이터가 PostgreSQL에 저장되므로 새로고침 이후에도 데이터가 유지됩니다.

### 2. Docker Compose 즉시 실행 환경

PostgreSQL을 별도로 설치하지 않아도 Docker Compose 명령어만으로 DB 환경을 실행할 수 있습니다.

```bash
docker compose up -d
```

### 3. 엑셀 파일 데이터 가져오기

엑셀 파일을 업로드해 데이터를 추가할 수 있습니다.

```text
엑셀 업로드
→ 과제용 데이터 시트 파싱
→ 활동 데이터 변환
→ PostgreSQL 저장
→ 화면 데이터 갱신
```

---

## 주의 사항

### 환경변수

`.env.local`은 Git에 포함하지 않습니다.  
대신 `.env.example`을 참고하여 로컬 환경에서 직접 생성해야 합니다.

### 과제 엑셀 원본 파일

과제 제공 엑셀 원본 파일은 Git에 포함하지 않습니다.  
실행 후 데이터 관리 탭에서 직접 업로드하여 사용합니다.

### PostgreSQL 포트

로컬 PostgreSQL과 충돌을 피하기 위해 Docker PostgreSQL은 다음 포트를 사용합니다.

```text
localhost:5433 → container:5432
```